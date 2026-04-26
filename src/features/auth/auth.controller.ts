import type { Request, Response } from "express";
import { supabase } from "../../config/supabase.js";
import type { RegisterBody, LoginBody } from "./auth.types.js";
import type { AuthJwtPayload } from "../../types/jwt.types.js";
import { clearAuthCookies, setAccessTokenCookie, setRefreshTokenCookie } from "../../utils/cookies.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import { hash, compare } from "../../utils/bcrypt.js";
import logger from "../../utils/logger.js";
import { clearRefreshTokenFromDb } from "./auth.helpers.js";
import { generateToken, hashToken } from "../../utils/crypto.js";
import { sendResetEmail } from "../../utils/mailer.js";

export const register = async (req: Request<{}, {}, RegisterBody, {}>, res: Response) => {
    try {
        const { firstName, lastName, email, password } = req.body;
    
        const { data: existingUsers, error: selectError } = await supabase
          .from("users")
          .select("id")
          .eq("email", email);
    
        if(selectError) {
            logger("Error checking existing user in register controller:", selectError);
            return res.status(500).json({
                success: false,
                message: `Internal Server Error`
            });
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
            .select("*")
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

        const payload = { id: user.id, role: user.role };
    
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
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            avatar: user.avatar,
        };
    
        return res.status(200).json({success: true, message: "Logged in successfully", data});
        
    } catch (error) {
        logger("Unexpected error in login controller:", error);
        return res.status(500).json({success: false, message: "Internal Server Error"});
    }
}

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, first_name, last_name")
      .eq("email", email)
      .maybeSingle();

    if (!user) {
      logger("Password reset requested for non-existent email:", email);
      return res.status(200).json({ success: true, message: "If an account with that email exists, a reset link has been sent" });
    }

    if (error) {
      logger("Error fetching user in forgotPassword controller:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }

    const { rawToken, hashedToken, expiresAt } = await generateToken(32);

    const { error: updateError } = await supabase.from("users").update({
      reset_password_token: hashedToken,
      reset_password_expires_at: expiresAt,
    }).eq("id", user.id);

    if (updateError) {
      logger("Error updating reset token in database for user ID:", user.id, "Error:", updateError);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }

    const resetCode = rawToken.slice(0, 6).toUpperCase();
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

    await sendResetEmail(user.email, resetLink, resetCode);

    return res.status(200).json({ success: true, message: "If an account with that email exists, a reset link has been sent" });

  } catch (error) {
    logger("Unexpected error in forgotPassword controller:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export const resetPasswrod = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      logger("Reset password attempt with missing token or new password");
      return res.status(400).json({ success: false, message: "Token and new password are required" });
    }

    const hashedToken = hashToken(token);

    const { data: user, error } = await supabase
      .from("users")
      .select("id, reset_password_token, reset_password_expires_at")
      .eq("reset_password_token", hashedToken)
      .maybeSingle();

    if (!user) {
      logger("Invalid or expired reset token used:", token);
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    if (error) {
      logger("Error fetching user in resetPassword controller:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }

    const isExpired = user.reset_password_expires_at && new Date(user.reset_password_expires_at) < new Date();
    if (isExpired) {
      logger("Expired reset token used for user ID:", user.id);
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    const hashedNewPassword = await hash(newPassword, 10);

    const { error: updateError } = await supabase.from("users").update({
      password: hashedNewPassword,
      reset_password_token: null,
      reset_password_expires_at: null,
      refresh_token: null, // log out from all devices after password reset
    }).eq("id", user.id);

    if (updateError) {
      logger("Error updating password in database for user ID:", user.id, "Error:", updateError);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }

    return res.status(200).json({ success: true, message: "Password reset successfully" });

  } catch (error) {
    logger("Unexpected error in resetPassword controller:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
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

        if(!data) {
            logger("User not found in refresh controller for ID:", decoded.id);
            clearAuthCookies(res);
            return res.status(404).json({success: false, message: "User not found" });
        }
    
        if (!data.refresh_token || !await compare(token, data.refresh_token)) {
            logger("Refresh token mismatch or missing for user ID:", decoded.id);
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
    
        const { data: user, error: fetchError } = await supabase.from("users").select("id, email, avatar, first_name, last_name, role").eq("id", userId).maybeSingle();
    
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