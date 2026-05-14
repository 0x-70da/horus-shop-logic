import type { Request, Response } from "express";
import logger from "../../utils/logger.js";
import { supabase } from "../../config/supabase.js";

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
