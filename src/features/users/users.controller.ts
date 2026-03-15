import { supabase } from "../../config/supabase.js";
import type { Request, Response } from "express";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
  
    if(!userId) {
      return res.status(401).json({success: false, message: "Unauthorized" });
    }
  
    const { data: user, error } = await supabase
      .from("users")
      .select("avatar, created_at, email, first_name, id, last_name, phone, role")
      .eq("id", userId)
      .maybeSingle();
  
    if(error) {
      return res.status(500).json({success: false, message: "Error fetching user profile"});
    }
  
    if(!user) {
      return res.status(404).json({success: false, message: "User not found"});
    }
  
    res.json({success: true, data: user});

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }

}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if(!userId) {
        return res.status(401).json({success: false, message: "Unauthorized" });
    }

    const { avatar, email, first_name, last_name, phone, password } = req.body;

    const { data: user, error } = await supabase
    .from("users")
    .update({ avatar, email, first_name, last_name, phone, password })
    .eq("id", userId)
    .select()
    .maybeSingle();

    if(error) {
        return res.status(500).json({success: false, message: "Error updating user profile"});
    }

    if(!user) {
        return res.status(404).json({success: false, message: "User not found"});
    }

    res.json({success: true, data: user});

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }

}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { data: users, error } = await supabase
    .from("users")
    .select("*");

    if(error) {
        return res.status(500).json({success: false, message: "Error fetching all users"});
    }

    if (!users || users.length === 0) {
        return res.status(404).json({success: false, message: "No users found"});
    }

    res.json({success: true, data: users});

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
  
}