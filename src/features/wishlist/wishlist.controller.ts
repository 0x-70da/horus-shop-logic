import type { Request, Response } from "express";
import { supabase } from "../../config/supabase.js";
import logger from "../../utils/logger.js";
import { wishlistItemsSchema } from "./wishlist.schema.js";

export const getWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { data, error } = await supabase
      .from("wishlist_items")
      .select("*, products(name, price, images)")
      .eq("user_id", userId);

    if (error) {
      logger("Error fetching wishlist:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch wishlist" });
    }

    const wishlistItems = data?.map((item) => {
      return {
        id: item.id,
        productId: item.product_id,
        userId: item.user_id,
        name: item.products.name,
        price: item.products.price,
        images: item.products.images,
        createdAt: item.created_at,
      };
    });

    res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully",
      data: wishlistItems,
    });
  } catch (error) {
    logger("Error in getWishlist controller:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const addToWishlist = async (
  req: Request<{}, {}, { itemId: string }, {}>,
  res: Response,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const safeInputs = wishlistItemsSchema.safeParse(req.body);

    if (!safeInputs.success) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    const { itemId } = safeInputs.data;

    const { data: wishlistItem, error } = await supabase
      .from("wishlist_items")
      .insert({ user_id: userId, product_id: itemId })
      .select()
      .single();

    if (error) {
      logger("Error adding item to wishlist:", error);
      return res
        .status(400)
        .json({ success: false, message: "Failed to add item to wishlist" });
    }

    res.status(201).json({
      success: true,
      message: "Item added to wishlist",
      data: wishlistItem,
    });
  } catch (error) {
    logger("Error in addToWishlist controller:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const removeFromWishlist = async (
  req: Request<{ itemId: string }, {}, {}, {}>,
  res: Response,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const safeInputs = wishlistItemsSchema.safeParse(req.params);
    if (!safeInputs.success) {
      logger("Validation error in removeFromWishlist:", safeInputs.error);
      return res.status(400).json({
        success: false,
        message: "Invalid inputs for removing from wishlist",
      });
    }

    const { itemId } = safeInputs.data;

    if (!itemId) {
      return res
        .status(400)
        .json({ success: false, message: "Item ID is required" });
    }

    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("id", itemId)
      .eq("user_id", userId);

    if (error) {
      logger("Error removing item from wishlist:", error);
      return res.status(400).json({
        success: false,
        message: "Failed to remove item from wishlist",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Item removed from wishlist" });
  } catch (error) {
    logger("Error in removeFromWishlist controller:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
