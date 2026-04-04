import type { Request, Response } from "express";
import { supabase } from "../../config/supabase.js";
import logger from "../../utils/logger.js";
import { getProductsQuerySchema, type GetProductsQuery } from "./products.schema.js";

export const getProducts = async (
  req: Request<{}, {}, {}, GetProductsQuery>,
  res: Response,
) => {
  try {
    const parsedQuery = getProductsQuerySchema.safeParse(req.query);
    
    if (!parsedQuery.success) {
      logger("Invalid query parameters:", parsedQuery.error);
      return res.status(400).json({
        success: false,
        message: parsedQuery.error.issues[0]?.message || "Invalid query parameters",
      })
    }

    const { category, subcategory, brand, minPrice, maxPrice, inStock, sortBy, sortOrder, page, limit } = parsedQuery.data;

    const offset = (page - 1) * limit;

    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq("category_slug", category);
    }

    if (subcategory) {
      query = query.eq("subcategory_slug", subcategory);
    }

    if (brand) {
      query = query.eq("brand", brand);
    }

    if (minPrice) {
      query = query.gte("price", minPrice);
    }

    if (maxPrice) {
      query = query.lte("price", maxPrice);
    }

    if (inStock === "true") {
      query = query.gt("stock", 0);
    }

    switch (sortBy) {
      case "price":
        query = query.order("price", { ascending: sortOrder === "asc" });
        break;
      case "newest":
        query = query.order("created_at", { ascending: sortOrder === "asc" });
        break;
      case "popularity":
        query = query.order("review_count", { ascending: sortOrder === "asc" });
        break;
      case "rating":
        query = query.order("rating", { ascending: sortOrder === "asc" });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    const { data: products, error, count } = await query;

    if (error) {
      logger("Error fetching products:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch products" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Products fetched successfully",
        data: {
          products,
          pagination: {
            page: page,
            limit: limit,
            total: count ?? 0,
            totalPages: Math.ceil((count ?? 0) / limit),
          },
        },
      });
  } catch (error) {
    logger("Error in getProducts controller:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getProductBySlug = async (
  req: Request<{ slug: string }>,
  res: Response,
) => {
  try {
    const { slug } = req.params;

    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      logger("Error fetching product by slug:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch product" });
    }

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Product fetched successfully",
        data: product,
      });
  } catch (error) {
    logger("Error in getProductBySlug controller:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
