// features/addresses/addresses.controller.ts
import type { Request, Response } from "express";
import { supabase } from "../../config/supabase.js";
import logger from "../../utils/logger.js";
import { createAddressSchema, updateAddressSchema } from "./addresses.schema.js";

export const getAddresses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { data, error } = await supabase
      .from("addresses")
      .select("id, full_name, address_line, city, state, country, phone, zip_code, is_default, created_at")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      logger("Error fetching addresses:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch addresses" });
    }

    return res.status(200).json({ success: true, message: "Addresses fetched successfully", data });
  } catch (error) {
    logger("Error in getAddresses:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const parsed = createAddressSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid request body",
      });
    }

    const { fullName, addressLine, city, state, country, phone, zipCode, isDefault } = parsed.data;

    // لو is_default = true، الـ trigger في الـ database هيعمل الباقيين false تلقائياً
    const { data, error } = await supabase
      .from("addresses")
      .insert({
        user_id:      userId,
        full_name:    fullName,
        address_line: addressLine,
        city,
        state:        state ?? null,
        country,
        phone:        phone ?? null,
        zip_code:     zipCode ?? null,
        is_default:   isDefault ?? false,
      })
      .select("id, full_name, address_line, city, state, country, phone, zip_code, is_default")
      .single();

    if (error) {
      logger("Error creating address:", error);
      return res.status(500).json({ success: false, message: "Failed to create address" });
    }

    return res.status(201).json({ success: true, message: "Address created successfully", data });
  } catch (error) {
    logger("Error in createAddress:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateAddress = async (req: Request<{ addressId: string }>, res: Response) => {
  try {
    const userId    = req.user?.id;
    const { addressId } = req.params;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const parsed = updateAddressSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid request body",
      });
    }

    const { fullName, addressLine, city, state, country, phone, zipCode, isDefault } = parsed.data;

    const { data, error } = await supabase
      .from("addresses")
      .update({
        full_name:    fullName,
        address_line: addressLine,
        city,
        state:        state ?? null,
        country,
        phone:        phone ?? null,
        zip_code:     zipCode ?? null,
        is_default:   isDefault,
      })
      .eq("id", addressId)
      .eq("user_id", userId)   // الـ user يعدل بس العناوين بتاعته
      .select("id, full_name, address_line, city, state, country, phone, zip_code, is_default")
      .maybeSingle();

    if (error) {
      logger("Error updating address:", error);
      return res.status(500).json({ success: false, message: "Failed to update address" });
    }

    if (!data) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    return res.status(200).json({ success: true, message: "Address updated successfully", data });
  } catch (error) {
    logger("Error in updateAddress:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteAddress = async (req: Request<{ addressId: string }>, res: Response) => {
  try {
    const userId        = req.user?.id;
    const { addressId } = req.params;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", addressId)
      .eq("user_id", userId);

    if (error) {
      logger("Error deleting address:", error);
      return res.status(500).json({ success: false, message: "Failed to delete address" });
    }

    return res.status(200).json({ success: true, message: "Address deleted successfully", data: null });
  } catch (error) {
    logger("Error in deleteAddress:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const setDefaultAddress = async (req: Request<{ addressId: string }>, res: Response) => {
  try {
    const userId        = req.user?.id;
    const { addressId } = req.params;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    // الـ trigger في الـ database هيعمل الباقيين false تلقائياً
    const { data, error } = await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", addressId)
      .eq("user_id", userId)
      .select("id, full_name, is_default")
      .maybeSingle();

    if (error) {
      logger("Error setting default address:", error);
      return res.status(500).json({ success: false, message: "Failed to set default address" });
    }

    if (!data) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    return res.status(200).json({ success: true, message: "Default address updated", data });
  } catch (error) {
    logger("Error in setDefaultAddress:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};