import { supabase } from "../../config/supabase.js";
import type { Request, Response } from "express";

export const getProfile = async (req: any, res: any) => {
  const userId = req.user.id;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  res.json(data);
};

export const updateProfile = async (req: any, res: Response) => {
    const userId = req.user.id;

    const updates = req.body;

    const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

    if(error) {
        return res.status(400).json({message: error.message});
    }

    res.json(data);
}

export const getAllUsers = async (req: Request, res: Response) => {
    const { data, error } = await supabase
    .from("users")
    .select("*");

    if(error) {
        return res.status(400).json({message: error.message});
    }

    res.json(data);
}