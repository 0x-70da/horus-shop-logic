import type { Request, Response } from "express";
import { supabase } from "../../config/supabase.js";
import logger from "../../utils/logger.js";
import { getProductsQuerySchema } from "./products.schema.js";
import type { GetProductsQuery } from "./products.types.js";

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
        message:
          parsedQuery.error.issues[0]?.message || "Invalid query parameters",
      });
    }

    const {
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      inStock,
      sortBy,
      sortOrder,
      page,
      limit,
    } = parsedQuery.data;

    const offset = (page - 1) * limit;

    let query = supabase
      .from("products_with_price")
      .select(
        "*,categories(name),subcategories(name),brands(name),product_variants(*)",
        { count: "exact" },
      )
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq("category_id", category);
    }

    if (subcategory) {
      query = query.eq("subcategory_id", subcategory);
    }

    if (brand) {
      query = query.eq("brand_id", brand);
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

    if (inStock === "false") {
      query = query.eq("stock", 0);
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

    const { data, error, count } = await query;

    if (error) {
      logger("Error fetching products:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch products" });
    }

    if (!data || data.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No products found",
        data: {
          products: [],
          pagination: {
            page: page,
            limit: limit,
            total: 0,
            totalPages: 0,
          },
        },
      });
    }

    const isBestSeller = data.some((product) =>
      product.total_sold ? product.total_sold >= 100 : false,
    );
    const isNewArrival = data.some((product) => {
      const createdAt = new Date(product.created_at!);
      const now = new Date();
      const diffInDays =
        (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24);
      return diffInDays <= 30;
    });
    const isFeatured = data.some((product) =>
      product.rating ? product.rating >= 4.5 : false,
    );

    const products = data.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      currentPrice: product.current_price,
      stock: product.stock,
      totalSold: product.total_sold,
      categoryId: product.category_id,
      subcategoryId: product.subcategory_id,
      brandId: product.brand_id,
      category: product.categories?.name,
      subcategory: product.subcategories?.name,
      brand: product.brands?.name,
      rating: product.rating,
      reviewCount: product.review_count,
      images: product.images,
      tags: product.tags,
      isActive: product.is_active,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
      isBestSeller,
      isNewArrival,
      isFeatured,
      dealId: product.deal_id,
      discountPercent: product.deal_discount_percent,
      dealEndsAt: product.deal_ends_at,
      dealQuantity: product.deal_quantity,
      dealSoldCount: product.deal_sold_count,
      variants: product.product_variants?.map((variant) => ({
        id: variant.id,
        name: variant.name,
        productId: variant.product_id,
        price: Number(
          variant.price_modifier +
            (product.current_price ?? product.price ?? 0),
        ),
        stock: variant.stock,
        sku: variant.sku,
        attributes: variant.attributes,
        isActive: variant.is_active,
        createdAt: variant.created_at,
      })),
    }));

    return res.status(200).json({
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

export const getProductById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("products_with_price")
      .select(
        "*,categories(name),subcategories(name),brands(name),product_variants(*),reviews(*)",
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      logger("Error fetching product by id:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch product" });
    }

    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    }

    const product = {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      currentPrice: data.current_price,
      stock: data.stock,
      totalSold: data.total_sold,
      categoryId: data.category_id,
      subcategoryId: data.subcategory_id,
      brandId: data.brand_id,
      category: data.categories?.name,
      subcategory: data.subcategories?.name,
      brand: data.brands?.name,
      rating: data.rating,
      reviewCount: data.review_count,
      images: data.images,
      tags: data.tags,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      dealId: data.deal_id,
      discountPercent: data.deal_discount_percent,
      dealEndsAt: data.deal_ends_at,
      dealQuantity: data.deal_quantity,
      dealSoldCount: data.deal_sold_count,
      reviews: data.reviews?.map((review) => ({
        id: review.id,
        productId: review.product_id,
        userId: review.user_id,
        orderId: review.order_id,
        title: review.title,
        comment: review.comment,
        rating: review.rating,
        helpful: review.helpful,
        verified: review.verified,
        createdAt: review.created_at,
      })),
      variants: data.product_variants?.map((variant) => ({
        id: variant.id,
        name: variant.name,
        productId: variant.product_id,
        price: Number(
          variant.price_modifier + (data.current_price ?? data.price ?? 0),
        ),
        stock: variant.stock,
        sku: variant.sku,
        attributes: variant.attributes,
        isActive: variant.is_active,
        createdAt: variant.created_at,
      })),
    };

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    logger("Error in getProductById controller:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
