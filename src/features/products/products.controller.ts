import type { Request, Response } from "express";
import { supabase } from "../../config/supabase.js";

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const { data: products, error } = await supabase.from("products").select("*");
    
        if(error) {
            return res.status(500).json({success: false, message: "Failed to fetch products: " + error.message });
        }
    
        return res.status(200).json({success: true, data: products });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}

export const getProductBySlug = async (req: Request<{ slug: string }>, res: Response) => {
    try {
        const { slug } = req.params;
    
        const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();
    
        if (error) {
            console.log("Error fetching product by slug:", error);
            return res.status(500).json({success: false, message: "Failed to fetch product"});
        }
        
        if (!product) {
            return res.status(404).json({success: false, message: "Product Not Found" });
        }
    
        return res.status(200).json({success: true, data: product });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}

export const getProductsByCategory = async (req: Request<{slug: string}>, res: Response) => {
    try {
        const { slug } = req.params;
    
        const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_slug", slug);
    
        if (error) {
            return res.status(500).json({success: false, message: "Failed to fetch products" });
        }
    
        if (!products || products.length === 0) {
            return res.status(404).json({success: false, message: "No products found for this category" });
        }
    
        return res.status(200).json({success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
    
}
