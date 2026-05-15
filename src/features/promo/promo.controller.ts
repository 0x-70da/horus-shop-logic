import type { Request, Response } from "express";
import logger from "../../utils/logger.js";
import { supabase } from "../../config/supabase.js";
import { promoCodeSchema } from "./promo.schema.js";

export const getPromoBanners = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("promo_banners").select("*");

    if (error) {
      logger("Error fetching promo banners:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch promo banners" });
    }

    return res.status(200).json({ success: true, message: "Promo banners fetched successfully", data });
  } catch (error) {
    logger("Error in PromoController:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export const validatePromoCode = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger("Unauthorized access to validate promo code");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const safeBody = promoCodeSchema.safeParse(req.body);
    if (!safeBody.success) {
      logger("Invalid parameters for promo code validation:", safeBody.error.issues[0]?.message || "Invalid request body");
      return res.status(400).json({ success: false, message: "Invalid request body"});
    }

    const { code, orderTotal } = safeBody.data;

    const { data, error } = await supabase.rpc("validate_promo_code", {
      p_code: code,
      p_total: orderTotal,
      p_user_id: userId
    });

    if (error) {
      logger("Error validating promo code:", error);
      return res.status(500).json({ success: false, message: "Failed to validate promo code" });
    }

    const result = data as {
      valid: boolean;
      message: string;
      discount?: number;
      promo_id?: string;
      promo_type?: string;
      promo_value?: number;
    }

    if (!result.valid) {
      logger("Promo code validation failed:", result.message);
      return res.status(400).json({ success: false, message: "Promo code is not valid" });
    }

    return res.status(200).json({
      success: true,
      message: "Promo code is valid",
      data: {
        discount: result.discount,
        promoId: result.promo_id,
        promoType: result.promo_type,
        promoValue: result.promo_value
      }
    });

  } catch (error) {
    logger("Error in PromoController:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
