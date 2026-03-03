import type { Response } from "express";
import { supabase } from "../../config/supabase.js"
import type { CartRequest } from "./cart.types.js";

export const getCart = async (req: CartRequest, res: Response) => {
    const userId = req.user?.id;

    if(!userId) {
        return res.status(400).json({success: false, message: "User ID is required" });
    }

    const { data, error } = await supabase
        .from("cart_items")
        .select(`
            id,
            quantity,
            products (
                id,
                name,
                price,
                images,
                stock
            )
        `)
        .eq("user_id", userId);

    if (error) {
        return res.status(400).json({success: false, message: error.message });
    }

    res.status(200).json({success: true, data });
}

export const addToCart = async (req: CartRequest, res: Response) => {
    const userId = req.user?.id;

    if(!userId) {
        return res.status(400).json({success: false, message: "User ID is required" });
    }

    const { productId, quantity } = req.body;

    if(!productId || !quantity) {
        return res.status(400).json({success: false, message: "Product ID and quantity are required" });
    }

    const { data: product } = await supabase
        .from("products")
        .select("stock")
        .eq("id", productId)
        .single();

    if (!product || product.stock < quantity) {
    return res.status(400).json({success: false, message: "Not enough stock" });
  }

  // insert or update
  const { data, error } = await supabase
    .from("cart_items")
    .upsert(
      {
        user_id: userId,
        product_id: productId,
        quantity,
      },
      { onConflict: "user_id,product_id" }
    )
    .select()
    .single();

  if (error) {
    return res.status(400).json({success: false, message: error.message });
  }

  res.status(201).json({success: true, data });
}

export const updateCartItem = async (req: CartRequest, res: Response) => {
    const userId = req.user?.id;

    if(!userId) {
        return res.status(400).json({success: false, message: "User ID is required" });
    }

    const itemId = req.params.itemId;
    const { quantity } = req.body;

    if(!itemId || !quantity) {
        return res.status(400).json({success: false, message: "Item ID and quantity are required" });
    }

    const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId)
    .eq("user_id", userId)
    .select()

    if (error) {
        return res.status(400).json({success: false, message: error.message });
    }

    res.status(200).json({success: true, data });
}

export const removeFromCart = async (req: CartRequest, res: Response) => {
    const userId = req.user?.id;

    if(!userId) {
        return res.status(400).json({success: false, message: "User ID is required" });
    }

    const itemId = req.params.itemId;

    if(!itemId) {
        return res.status(400).json({success: false, message: "Item ID is required" });
    }

    const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", userId);

    if (error) { 
        return res.status(400).json({success: false, message: error.message });
    }

    res.json({success: true, message: "Item removed" });
}

export const clearCart = async (req: CartRequest, res: Response) => {
    const userId = req.user?.id;

    if(!userId) {
        return res.status(400).json({success: false, message: "User ID is required" });
    }

    const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);

    if (error) {
        return res.status(400).json({success: false, message: error.message });
    }

    res.json({success: true, message: "Cart cleared" });
}