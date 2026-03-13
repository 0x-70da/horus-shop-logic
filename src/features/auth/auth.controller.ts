import type { Request, Response } from "express";
import { supabase } from "../../config/supabase.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import type { RegisterBody, LoginBody } from "./auth.types.js";
dotenv.config();

export const register = async (req: Request<{}, {}, RegisterBody, {}>, res: Response) => {
    const { firstName, lastName, email, password } = req.body;

    const { data: user, error: selectError } = await supabase.from("users").select("*").eq("email", email);

    if(selectError) {
        return res.status(500).json({success: false, message: `Internal Server Error`});
    }
    
    if(user && user.length > 0) {
        return res.status(400).json({success: false, message: "User already exists"});
    }

    const hashed = await bcrypt.hash(password, 10);

    const { error: insertError } = await supabase.from("users").insert({
        email,
        password: hashed,
        first_name: firstName,
        last_name: lastName,
    });

    if(insertError) {
        return res.status(500).json({success: false, message: insertError.message});
    }

    return res.status(201).json({success: true, message: "User registered successfully"});
}

export const login = async (req: Request<{}, {}, LoginBody, {}>, res: Response) => {
    const { email, password } = req.body;

    const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single();

    if(error || !user) {
        return res.status(401).json({success: false, message: "Invalid email or password"});
    }

    const matched = await bcrypt.compare(password, user.password);

    if(!matched) {
        return res.status(401).json({success: false, message: "Invalid email or password"});
    }

    const token = jwt.sign({ id: user.id, role: user.role?? "USER" }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    return res.status(200).cookie("token", token, { httpOnly: true }).json({success: true, message: "Logged in successfully"});
}
