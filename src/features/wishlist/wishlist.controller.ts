import { supabase } from "../../config/supabase.js";

export const getWishlist = async (req: any, res: any) => {
    const userId = req.user.id;

    const { data, error } = await supabase
    .from("wishlist_items")
    .select("id, product_id, products(name, price, image_url)")
    .eq("user_id", userId);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(200).json(data);
}

export const addToWishlist = async (req: any, res: any) => {
    const userId = req.user.id;
    const { productId } = req.body;

    const { data, error } = await supabase
    .from("wishlist_items")
    .insert({ user_id: userId, product_id: productId })
    .select()
    .single();

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
}

export const removeFromWishlist = async (req: any, res: any) => {
    const userId = req.user.id;
    const { id } = req.params;

    const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(204).json({ message: "Item removed from wishlist" });
}