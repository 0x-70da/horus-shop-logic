import { supabase } from "../../config/supabase.js"

export const getCart = async (req: any, res: any) => {
    const userId = req.user.id;

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
        return res.status(400).json({ error: error.message });
    }

    res.status(200).json(data);
}

export const addToCart = async (req: any, res: any) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const { data: product } = await supabase
        .from("products")
        .select("stock")
        .eq("id", productId)
        .single();

    if (!product || product.stock < quantity) {
    return res.status(400).json({ message: "Not enough stock" });
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
    return res.status(400).json({ message: error.message });
  }

  res.status(201).json(data);
}

export const updateCartItem = async (req: any, res: any) => {
    const userId = req.user.id;
    const itemId = req.params.itemId;
    const { quantity } = req.body;

    const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId)
    .eq("user_id", userId)
    .select()
    .single();

    if (error) {
        return res.status(400).json({ message: error.message });
    }

    res.status(200).json(data);
}

export const removeFromCart = async (req: any, res: any) => {
    const userId = req.user.id;
    const itemId = req.params.itemId;

    const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", userId);

    if (error) { 
        return res.status(400).json({ message: error.message });
    }

    res.json({ message: "Item removed" });
}

export const clearCart = async (req: any, res: any) => {
    const userId = req.user.id;

    const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);

    if (error) {
        return res.status(400).json({ message: error.message });
    }

    res.json({ message: "Cart cleared" });
}