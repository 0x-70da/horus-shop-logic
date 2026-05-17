import type { Request, Response } from "express";
import { supabase } from "../../config/supabase.js";
import logger from "../../utils/logger.js";

export const getAllBrands = async (req: Request, res: Response) => {
  try {
    const { data: brands, error } = await supabase
      .from("brands")
      .select("*", { count: "exact" });

    if (error) {
      logger("Error fetching brands:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch brands" });
    }

    if (!brands || brands.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No brands found" });
    }

    res.status(200).json({
      success: true,
      message: "Brands fetched successfully",
      data: brands,
    });
  } catch (error) {
    logger("Error in getAllBrands controller:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
