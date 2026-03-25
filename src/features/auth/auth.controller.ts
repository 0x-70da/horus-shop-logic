import type { Request, Response } from "express";
import { supabase } from "../../config/supabase.js";
import dotenv from "dotenv";
import type { RegisterBody, LoginBody } from "./auth.types.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import logger from "../../utils/logger.js";
import { clearAuthCookies, setAccessTokenCookie, setRefreshTokenCookie } from "../../utils/cookies.js";
import type { AuthJwtPayload } from "../../types/jwt.types.js";
import { clearRefreshTokenFromDb } from "./auth.helpers.js";
import { hash, compare } from "../../utils/bcrypt.js";
dotenv.config();

export const register = async (req: Request<{}, {}, RegisterBody, {}>, res: Response) => {
    try {
        const { firstName, lastName, email, password } = req.body;
    
        const { data: existingUsers, error: selectError } = await supabase.from("users").select("id").eq("email", email);
    
        if(selectError) {
            logger("Error checking existing user in register controller:", selectError);
            return res.status(500).json({success: false, message: `Internal Server Error`});
        }
        
        if(existingUsers && existingUsers.length > 0) {
            logger("Attempt to register with existing email:", email);
            return res.status(400).json({success: false, message: "User already exists"});
        }
    
        const hashed = await hash(password, 10);
    
        const { error: insertError } = await supabase.from("users").insert({
            email,
            password: hashed,
            first_name: firstName,
            last_name: lastName,
        });
    
        if(insertError) {
            logger("Error inserting user in register controller:", insertError);
            return res.status(500).json({success: false, message: "Failed to register user"});
        }
    
        return res.status(201).json({success: true, message: "User registered successfully"});

    } catch (error) {
        logger("Unexpected error in register controller:", error);
        return res.status(500).json({success: false, message: "Internal Server Error"});
    }
    
}

export const login = async (req: Request<{}, {}, LoginBody, {}>, res: Response) => {
    try {
        const { email, password } = req.body;
    
        const { data: user, error } = await supabase
            .from("users")
            .select("id, password, role")
            .eq("email", email)
            .maybeSingle();
    
        if (error) {
            logger("Error fetching user in login controller:", error);
            return res.status(500).json({success: false, message: "Internal Server Error"});
        }

        if (!user) {
            logger("Login attempt with non-existent email:", email);
            return res.status(401).json({success: false, message: "Invalid email or password"});
        }
    
        const matched = await compare(password, user.password);
    
        if(!matched) {
            logger("Login attempt with invalid password for email:", email);
            return res.status(401).json({success: false, message: "Invalid email or password"});
        }

        const payload = { id: user.id, role: user.role ?? "USER" };
    
        const accessToken = generateAccessToken(payload, "15m");
        const refreshToken = generateRefreshToken(payload, "7d");
        const hashedRefreshToken = await hash(refreshToken, 10);

        const { error: updateError } = await supabase.from("users").update({refresh_token: hashedRefreshToken,}).eq("id", user.id);

        if (updateError) {
            logger("Error updating refresh token in database for user ID:", user.id, "Error:", updateError);
            return res.status(500).json({success: false, message: "Internal Server Error" });
        }

        setAccessTokenCookie(res, accessToken);
        setRefreshTokenCookie(res, refreshToken);

        const data = {
            id: payload.id,
            role: payload.role,
        }
    
        return res.status(200).json({success: true, message: "Logged in successfully", data});
        
    } catch (error) {
        logger("Unexpected error in login controller:", error);
        return res.status(500).json({success: false, message: "Internal Server Error"});
    }
}

export const refresh = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.refresh_token;
    
        if (!token) {
            logger("Refresh token missing in request");
            return res.status(401).json({success: false, message: "Refresh token missing" });
        }
        
        const decoded: AuthJwtPayload = verifyRefreshToken(token);
    
        const { data, error: fetchError } = await supabase.from("users").select("refresh_token").eq("id", decoded.id).maybeSingle();
    
        if (fetchError) {
            logger("Error fetching user in refresh controller:", fetchError);
            return res.status(500).json({success: false, message: "Internal Server Error" });
        }
    
        if (!data || data.refresh_token !== token) {
            logger("Refresh token mismatch for user ID:", decoded.id);
            clearAuthCookies(res);
            await clearRefreshTokenFromDb(decoded.id);
            return res.status(401).json({success: false, message: "Invalid refresh token" });
        }
    
        const newAccessToken = generateAccessToken({ id: decoded.id, role: decoded.role }, "15m");
        const newRefreshToken = generateRefreshToken({ id: decoded.id, role: decoded.role }, "7d");
        const hashedNewRefreshToken = await hash(newRefreshToken, 10);
    
        const { error: updateError } = await supabase.from("users").update({ refresh_token: hashedNewRefreshToken }).eq("id", decoded.id);

        if (updateError) {
            logger("Error updating refresh token in database for user ID:", decoded.id, "Error:", updateError);
            return res.status(500).json({success: false, message: "Internal Server Error" });
        }
    
        setAccessTokenCookie(res, newAccessToken);
        setRefreshTokenCookie(res, newRefreshToken);
    
        return res.status(200).json({success: true, message: "Tokens refreshed successfully" });
        
    } catch (error) {
        logger("Unexpected error in refresh controller:", error);
        return res.status(500).json({success: false, message: "Internal Server Error" });
    }

}

export const me = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            logger("User ID missing in me controller");
            return res.status(401).json({success: false, message: "Unauthorized" });
        }
    
        const { data: user, error: fetchError } = await supabase.from("users").select("id, email, phone, avatar, first_name, last_name, role").eq("id", userId).maybeSingle();
    
        if (fetchError) {
            logger("Error fetching user in me controller:", fetchError);
            return res.status(500).json({success: false, message: "Internal Server Error" });
        }
    
        if (!user) {
            logger("User not found in me controller for ID:", userId);
            return res.status(404).json({ success: false, message: "User not found" });
        }
    
        return res.status(200).json({ success: true, message: "User info retrieved successfully", data: user });

    } catch (error) {
        logger("Unexpected error in me controller:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}

export const logout = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
    
        if (!userId) {
            logger("User ID missing in logout controller");
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
    
        await clearRefreshTokenFromDb(userId);
    
        clearAuthCookies(res);
    
        return res.status(200).json({ success: true, message: "Logged out successfully" });

    } catch (error) {
        logger("Unexpected error in logout controller:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}