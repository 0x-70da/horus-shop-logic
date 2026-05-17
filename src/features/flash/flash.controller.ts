import type { Request, Response } from "express";
import { supabase } from "../../config/supabase.js";
import logger from "../../utils/logger.js";

export const getFlashDeals = async (req: Request, res: Response) => {
  try {
    const now = new Date().toISOString();

    const { data: deals, error } = await supabase
      .from("flash_deals")
      .select(
        `
        id,
        discount_percent,
        start_date,
        end_date,
        deal_quantity,
        sold_count,
        product:products(
          id,
          name,
          slug,
          price,
          original_price,
          images,
          rating,
          review_count,
          stock,
          category:categories(id, name, slug),
          brand:brands(id, name, slug)
        )
        `,
      )
      .eq("is_active", true)
      .lte("start_date", now)
      .gte("end_date", now)
      .order("end_date", { ascending: true });
    if (error) {
      logger("Error fetching flash deals:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch flash deals",
      });
    }

    const dealsWithPrice = deals
      ?.filter(
        (deal) =>
          deal.deal_quantity === null || deal.sold_count < deal.deal_quantity,
      )
      .map((deal) => {
        const product = deal.product as any;
        const dealPrice = parseFloat(
          (product.price * (1 - deal.discount_percent / 100)).toFixed(2),
        );

        return {
          id: deal.id,
          discount_percent: deal.discount_percent,
          end_date: deal.end_date,
          remaining: deal.deal_quantity
            ? deal.deal_quantity - deal.sold_count
            : null,
          product: {
            ...product,
            current_price: dealPrice,
            original_price: product.price,
          },
        };
      });

    return res.status(200).json({
      success: true,
      message: "Flash deals fetched successfully",
      data: dealsWithPrice,
    });
  } catch (error) {
    logger("Error in getFlashDeals controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
