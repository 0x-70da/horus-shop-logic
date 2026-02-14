import { supabase } from "../../config/supabase.js";

export const getAllCategories = async (req: any, res: any) => {
    const { data, error } = await supabase.from("categories").select("*");

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.json(data);
}

export const getProductsByCategory = async (req: any, res: any) => {
    const { slug } = req.params;

    const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_slug", slug);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
}