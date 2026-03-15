import type { Request, Response } from "express";
import { supabase } from "../../config/supabase.js"

export const getCart = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
    
        if(!userId) {
            return res.status(401).json({success: false, message: "Unauthorized" });
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
            return res.status(400).json({success: false, message: "Cannot get cart: " + error.message });
        }
    
        res.status(200).json({success: true, data });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const addToCart = async (req: Request<{}, {}, { productId: string; quantity: number }, {}>, res: Response) => {
    try {
        const userId = req.user?.id;
    
        if(!userId) {
            return res.status(401).json({success: false, message: "Unauthorized" });
        }
    
        const { productId, quantity } = req.body;
    
        if(!productId || !quantity || quantity <= 0) {
            return res.status(400).json({success: false, message: "Product ID and quantity are required" });
        }
    
        const { data: product, error: productError } = await supabase
            .from("products")
            .select("stock")
            .eq("id", productId)
            .single();
    
        if (productError) {
            return res.status(400).json({success: false, message: "Cannot get product: " + productError.message });
        }
    
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
        return res.status(400).json({success: false, message: "Cannot add to cart" });
      }
    
      res.status(201).json({success: true, data });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const updateCartItem = async (req: Request<{itemId: string}, {}, { quantity: number }, {}>, res: Response) => {
    try {
        const userId = req.user?.id;
    
        if(!userId) {
            return res.status(401).json({success: false, message: "Unauthorized" });
        }
    
        const itemId = req.params.itemId;
        const { quantity } = req.body;
    
        if(!itemId || !quantity || quantity <= 0) {
            return res.status(400).json({success: false, message: "Item ID and quantity are required" });
        }
    
        const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", itemId)
        .eq("user_id", userId)
        .select()
    
        if (error) {
            return res.status(400).json({ success: false, message: "Cannot update cart item" });
        }
    
        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }
        res.status(200).json({success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const removeFromCart = async (req: Request<{itemId: string}, {}, {}, {}>, res: Response) => {
    try {
        const userId = req.user?.id;
    
        if(!userId) {
            return res.status(401).json({success: false, message: "Unauthorized" });
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
            return res.status(400).json({success: false, message: "Cannot remove item from cart" });
        }
    
        res.json({success: true, message: "Item removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const clearCart = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
    
        if(!userId) {
            return res.status(401).json({success: false, message: "Unauthorized" });
        }
    
        const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId);
    
        if (error) {
            return res.status(400).json({success: false, message: "Cannot clear cart" });
        }
    
        res.json({success: true, message: "Cart cleared" });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}