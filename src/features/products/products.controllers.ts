import type { Request, Response } from "express";
import { supabase } from "../../config/supabase.js";

export const getAllProducts = async (req: Request, res: Response) => {
    const { category, search } = req.query;

    let query = supabase.from("products").select("*");

    if(category) {
        query = query.eq("category_id", category);
    }

    if(search) {
        query = query.ilike("name", `%${search}%`);
    }

    const { data, error } = await query;

    if(error) {
        return res.status(500).json({ message: error.message });
    }

    return res.status(200).json(data);
}

export const getProductBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;

    const { data, error } = await supabase
    .from("products")
    .select(`
        *,
        categories (*),
        brands (*),
        product_variants (*)
        `).
        eq("slug", slug)
        .single();

    if(error) {
        return res.status(404).json({ message: "Product Not Found" });
    }

    return res.status(200).json(data);
}