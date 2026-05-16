import type { Request, Response } from "express";
import { supabase } from "../../config/supabase.js";
import logger from "../../utils/logger.js";
import { cartItemsSchema, updateOrRemoveCartSchema } from "./cart.schema.js";

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `*, products_with_price(id, name, price, current_price, stock, images), product_variants(id, name, price_modifier, sku, attributes, stock)`,
      )
      .eq("user_id", userId);

    if (error) {
      logger("Error fetching cart items:", error);
      return res
        .status(400)
        .json({ success: false, message: "Cannot Get Cart" });
    }

    const cartItems = data?.map((item) => {
      const price = item.products_with_price.price;
      const currentPrice = item.products_with_price.current_price ?? price;
      const variantPriceModifier = item.product_variants
        ? item.product_variants.price_modifier
        : 0;
      const finalPrice = parseFloat(
        (currentPrice + variantPriceModifier).toFixed(2),
      );
      return {
        id: item.id,
        productId: item.product_id,
        variantId: item.variant_id || null,
        variantName: item.product_variants ? item.product_variants.name : null,
        sku: item.product_variants ? item.product_variants.sku : null,
        attributes: item.product_variants
          ? item.product_variants.attributes
          : null,
        variantStock: item.product_variants
          ? item.product_variants.stock
          : null,
        userId: item.user_id,
        quantity: item.quantity,
        name: item.products_with_price.name,
        price,
        currentPrice: finalPrice,
        stock: item.product_variants
          ? item.product_variants.stock
          : item.products_with_price.stock,
        images: item.products_with_price.images,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        lineTotal: parseFloat((finalPrice * item.quantity).toFixed(2)),
      };
    });

    const subtotal = cartItems?.reduce((sum, i) => sum + i.lineTotal, 0) ?? 0;
    const itemCount = cartItems?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

    res
      .status(200)
      .json({
        success: true,
        data: { cartItems, subtotal, itemCount },
        message: "Cart fetched successfully",
      });
  } catch (error) {
    logger("Error in getCart controller:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const addToCart = async (
  req: Request<{}, {}, { itemId: string; quantity: number }, {}>,
  res: Response,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const safeBody = cartItemsSchema.safeParse(req.body);
    if (!safeBody.success) {
      logger("Validation error in addToCart:", safeBody.error);
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid inputs for adding cart items",
        });
    }

    const { itemId, variantId, quantity } = safeBody.data;

    if (variantId) {
      const { data: variant, error: variantError } = await supabase
        .from("product_variants")
        .select("stock, is_active")
        .eq("id", variantId)
        .eq("product_id", itemId)
        .single();

      if (variantError) {
        logger("Error fetching product variant:", variantError);
        return res
          .status(400)
          .json({ success: false, message: "Cannot Get Product Variant" });
      }

      if (!variant) {
        logger("Variant not found or inactive:", variantError);
        return res
          .status(400)
          .json({
            success: false,
            message: "Product variant is not available",
          });
      }

      if (variant.stock < quantity) {
        logger("Insufficient stock for variant:", {
          variantId,
          requested: quantity,
          available: variant.stock,
        });
        return res
          .status(400)
          .json({
            success: false,
            message: "Insufficient stock for the requested product variant",
          });
      }
    } else {
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("stock, is_active")
        .eq("id", itemId)
        .single();

      if (productError) {
        logger("Error fetching product:", productError);
        return res
          .status(400)
          .json({ success: false, message: "Cannot Get Product" });
      }

      if (!product) {
        logger("Product not found or inactive:", productError);
        return res
          .status(400)
          .json({ success: false, message: "Product is not available" });
      }

      if (product.stock < quantity) {
        logger("Insufficient stock for product:", {
          itemId,
          requested: quantity,
          available: product.stock,
        });
        return res
          .status(400)
          .json({
            success: false,
            message: "Insufficient stock for the requested product",
          });
      }
    }

    const { data: existingItem, error: findError } = variantId
      ? await supabase
          .from("cart_items")
          .select("id, quantity")
          .eq("user_id", userId)
          .eq("product_id", itemId)
          .eq("variant_id", variantId)
          .maybeSingle()
      : await supabase
          .from("cart_items")
          .select("id, quantity")
          .eq("user_id", userId)
          .eq("product_id", itemId)
          .is("variant_id", null)
          .maybeSingle();

    if (findError) {
      logger("Error checking existing cart item:", findError);
      return res
        .status(400)
        .json({ success: false, message: "Cannot add to cart" });
    }

    if (existingItem) {
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        logger("Error updating existing cart item:", error);
        return res
          .status(400)
          .json({ success: false, message: "Cannot add to cart" });
      }

      return res
        .status(200)
        .json({ success: true, message: "Item updated in cart", data });
    }

    const { data, error } = await supabase
      .from("cart_items")
      .insert({
        user_id: userId,
        product_id: itemId,
        variant_id: variantId ?? null,
        quantity,
      })
      .select()
      .single();

    if (error) {
      logger("Error adding item to cart:", error);
      return res
        .status(400)
        .json({ success: false, message: "Cannot add to cart" });
    }

    res
      .status(201)
      .json({ success: true, message: "Item added to cart", data });
  } catch (error) {
    logger("Error in addToCart controller:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateCartItem = async (
  req: Request<{ itemId: string }, {}, { quantity: number }, {}>,
  res: Response,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const safeInputs = updateOrRemoveCartSchema.safeParse({
      ...req.body,
      ...req.params,
    });
    if (!safeInputs.success) {
      logger("Validation error in updateCartItem:", safeInputs.error);
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid inputs for updating cart item",
        });
    }

    const { itemId } = safeInputs.data;
    const { quantity } = safeInputs.data;

    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", itemId)
      .eq("user_id", userId)
      .select();

    if (error) {
      logger("Error updating cart item:", error);
      return res
        .status(400)
        .json({ success: false, message: "Cannot update cart item" });
    }

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found" });
    }

    res.status(200).json({ success: true, message: "Cart item updated", data });
  } catch (error) {
    logger("Error in updateCartItem controller:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const removeFromCart = async (
  req: Request<{ itemId: string }, {}, {}, {}>,
  res: Response,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const safeInputs = updateOrRemoveCartSchema
      .partial()
      .safeParse({ ...req.params });
    if (!safeInputs.success) {
      logger("Validation error in removeFromCart:", safeInputs.error);
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid inputs for removing cart item",
        });
    }

    const { itemId } = safeInputs.data;

    if (!itemId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Item ID is required for removing cart item",
        });
    }

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId)
      .eq("user_id", userId);

    if (error) {
      logger("Error removing item from cart:", error);
      return res
        .status(400)
        .json({ success: false, message: "Cannot remove item from cart" });
    }

    res.json({ success: true, message: "Item removed" });
  } catch (error) {
    logger("Error in removeFromCart controller:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId);

    if (error) {
      logger("Error clearing cart:", error);
      return res
        .status(400)
        .json({ success: false, message: "Cannot clear cart" });
    }

    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    logger("Error in clearCart controller:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
