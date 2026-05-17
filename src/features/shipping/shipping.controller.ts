import type { Request, Response } from "express";
import logger from "../../utils/logger.js";
import { supabase } from "../../config/supabase.js";

export const getShippingMethods = async (req: Request, res: Response) => {
  try {
    const { data: shippingMethods, error } = await supabase
      .from("shipping_methods")
      .select("*");

    if (error) {
      logger("Error fetching shipping methods:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch shipping methods" });
    }

    res.json({
      success: true,
      message: "Shipping methods fetched successfully",
      data: shippingMethods,
    });
  } catch (error) {
    logger("Error fetching shipping methods:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch shipping methods" });
  }
};
