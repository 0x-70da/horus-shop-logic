import type { Request, Response } from "express";
import logger from "../../utils/logger.js";
import { supabase } from "../../config/supabase.js";

export const getTaxRates = async (req: Request, res: Response) => {
  try {
    const country = (req.query.country as string) ?? "EG";

    const { data: taxRates, error } = await supabase.from("tax_rates").select("id, country, region, rate").eq("country", country).eq("is_active", true).is("region", null).maybeSingle();

    if (error) {
      logger("Error fetching tax rates:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch tax rates" });
    }

    return res.status(200).json({ success: true, message: "Tax rates fetched successfully", data: {
      country,
      rate: taxRates?.rate ?? 0,
      percentage: taxRates?.rate ? taxRates.rate * 100 : 0
    }});

  } catch (error) {
    logger("Error in TaxController:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}