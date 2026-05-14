import type { Request, Response } from "express";
import logger from "../../utils/logger.js";
import { supabase } from "../../config/supabase.js";

export const getFlashDeals = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("flash_deals").select("*");

    if (error) {
      logger("Error fetching flash deals:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch flash deals" });
    }

    return res.status(200).json({ success: true, message: "Flash deals fetched successfully", data });
  } catch (error) {
    logger("Error in FlashController:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}