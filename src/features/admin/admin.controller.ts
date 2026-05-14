import type { Request, Response } from "express";
import { supabase } from "../../config/supabase.js";
import logger from "../../utils/logger.js";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { data: users, error } = await supabase
    .from("users")
    .select("avatar, created_at, email, first_name, id, last_name, phone, role");

    if(error) {
        logger("Error fetching all users:", error);
        return res.status(500).json({success: false, message: "Error fetching all users"});
    }

    if (!users || users.length === 0) {
        return res.status(404).json({success: false, message: "No users found"});
    }

    res.json({success: true, message: "Users fetched successfully", data: users.map(user => ({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      createdAt: user.created_at
    }))});

  } catch (error) {
    logger("Error in getAllUsers controller:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
  
}
