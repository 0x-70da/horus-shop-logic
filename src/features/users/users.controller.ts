import { supabase } from "../../config/supabase.js";
import type { Response } from "express";
import type { UserRequest } from "./users.types.js";

export const getProfile = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;

  if(!userId) {
    return res.status(401).json({success: false, message: "Unauthorized" });
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if(error) {
    console.log("Error fetching user profile:", error);
    return res.status(500).json({success: false, message: "Error fetching user profile"});
  }

  if(!user) {
    return res.status(404).json({success: false, message: "User not found"});
  }

  res.json({success: true, data: user});
};

export const updateProfile = async (req: UserRequest, res: Response) => {
    const userId = req.user?.id;

    if(!userId) {
        return res.status(401).json({success: false, message: "Unauthorized" });
    }

    const updates = req.body;

    const { data: user, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

    if(error) {
        console.log("Error updating user profile:", error);
        return res.status(500).json({success: false, message: "Error updating user profile"});
    }

    if(!user) {
        return res.status(404).json({success: false, message: "User not found"});
    }

    res.json({success: true, data: user});
}

export const getAllUsers = async (req: UserRequest, res: Response) => {
    const { data: users, error } = await supabase
    .from("users")
    .select("*");

    if(error) {
        console.log("Error fetching all users:", error);
        return res.status(500).json({success: false, message: "Error fetching all users"});
    }

    if (!users || users.length === 0) {
        return res.status(404).json({success: false, message: "No users found"});
    }

    res.json({success: true, data: users});
}