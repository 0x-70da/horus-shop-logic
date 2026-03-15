import type { Request, Response } from "express";
import { supabase } from "../../config/supabase.js";

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const { data: categories, error } = await supabase.from("categories").select("*");
    
        if (error) {
            console.log("Error fetching categories:", error);
            return res.status(500).json({success: false, message: "Failed to fetch categories"});
        }
    
        if(!categories || categories.length === 0) {
            return res.status(404).json({success: false, message: "No categories found" });
        }
    
        res.status(200).json({success: true, data: categories });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}