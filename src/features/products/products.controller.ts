import type { Request, Response } from "express";
import { supabase } from "../../config/supabase.js";
import logger from "../../utils/logger.js";

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const { data: products, error } = await supabase.from("products").select("*");
    
        if(error) {
            logger("Error fetching products:", error);
            return res.status(500).json({success: false, message: "Failed to fetch products: " + error.message });
        }
    
        return res.status(200).json({success: true, message: "Products fetched successfully", data: products });

    } catch (error) {
        logger("Error in getAllProducts controller:", error);
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
            logger("Error fetching product by slug:", error);
            return res.status(500).json({success: false, message: "Failed to fetch product"});
        }
        
        if (!product) {
            return res.status(404).json({success: false, message: "Product Not Found" });
        }
    
        return res.status(200).json({success: true, message: "Product fetched successfully", data: product });

    } catch (error) {
        logger("Error in getProductBySlug controller:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}
