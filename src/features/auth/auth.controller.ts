import type { Request, Response } from "express";
import { supabase } from "../../config/supabase.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req: Request, res: Response) => {
    const {firstName, lastName, email, password} = req.body;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if(error || !data.user){
        return res.status(400).json({message: error?.message});
    }

    await supabase.from("users").insert({
        id: data.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
    });

    return res.status(201).json({message: "User registered successfully"});
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if(error) {
        return res.status(401).json({message: "Invalid email or password"});
    }

    const token = jwt.sign({ id: data.user.id, role: data.user.role?? "USER" }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    return res.json({
        user: data.user,
        token,
    })
}
