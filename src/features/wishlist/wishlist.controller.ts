import type { Response } from "express";
import { supabase } from "../../config/supabase.js";
import type { WishListRequest } from "./wishlist.types.js";

export const getWishlist = async (req: WishListRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { data: wishlistItems, error } = await supabase
    .from("wishlist_items")
    .select("id, product_id, products(name, price, images)")
    .eq("user_id", userId);

    if (error) {
        console.log("Error fetching wishlist:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch wishlist" });
    }

    if(!wishlistItems || wishlistItems.length === 0) {
        return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    res.status(200).json({ success: true, data: wishlistItems });
}

export const addToWishlist = async (req: WishListRequest, res: Response) => {
    const userId = req.user?.id;

    if(!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { productId } = req.body;

    if(!productId) {
        return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const { data: wishlistItem, error } = await supabase
    .from("wishlist_items")
    .insert({ user_id: userId, product_id: productId })
    .select()
    .single();

    if (error) {
        console.log("Error adding item to wishlist:", error);
        return res.status(400).json({ success: false, message: "Failed to add item to wishlist" });
    }

    res.status(201).json({ success: true, data: wishlistItem });
}

export const removeFromWishlist = async (req: WishListRequest, res: Response) => {
    const userId = req.user?.id;

    if(!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { productId } = req.params;

    if(!productId) {
        return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("product_id", productId)
    .eq("user_id", userId);

    if (error) {
        console.log("Error removing item from wishlist:", error);
        return res.status(400).json({ success: false, message: "Failed to remove item from wishlist" });
    }

    res.status(200).json({ success: true, message: "Item removed from wishlist" });
}