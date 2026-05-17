import { supabase } from "../../config/supabase.js";
import type { Request, Response } from "express";
import logger from "../../utils/logger.js";
import type { User } from "./users.types.js";
import { usersSchema } from "./users.schema.js";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select(
        "avatar, created_at, email, first_name, id, last_name, phone, role",
      )
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      logger("Error fetching user profile:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error fetching user profile" });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile fetched successfully",
      data: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    logger("Error in getProfile controller:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateProfile = async (
  req: Request<{}, {}, User, {}>,
  res: Response,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const safeBody = usersSchema.safeParse(req.body);
    if (!safeBody.success) {
      logger("Validation error in updateProfile:", safeBody.error);
      return res.status(400).json({
        success: false,
        message: "Invalid inputs for updating profile",
      });
    }

    const { email, firstName, lastName, phone, avatar } = safeBody.data;

    const { data: user, error } = await supabase
      .from("users")
      .update({
        email,
        first_name: firstName,
        last_name: lastName,
        phone: phone ?? null,
        avatar: avatar ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select(
        "avatar, created_at, email, first_name, id, last_name, phone, role, updated_at",
      )
      .maybeSingle();

    if (error) {
      logger("Error updating user profile:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error updating user profile" });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        updatedAt: user.updated_at,
      },
    });
  } catch (error) {
    logger("Error in updateProfile controller:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
