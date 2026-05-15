import type { Request, Response } from "express";
import { createReviewSchema, getReviewsQuerySchema } from "./reviews.schema.js";
import { supabase } from "../../config/supabase.js";
import logger from "../../utils/logger.js";

export const getProductReviews = async (
  req: Request<{ productId: string }>,
  res: Response,
) => {
  try {
    const { productId } = req.params;
    const parsed = getReviewsQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid query parameters",
      });
    }

    const { page, limit, rating } = parsed.data;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("reviews")
      .select(
        `
        id,
        rating,
        title,
        comment,
        helpful,
        verified,
        created_at,
        user:users(first_name, last_name, avatar)
        `,
        { count: "exact" },
      )
      .eq("product_id", productId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (rating) query = query.eq("rating", rating);

    const { data: reviews, error, count } = await query;

    if (error) {
      logger("Error fetching reviews:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch reviews",
      });
    }

    // احسب توزيع الـ ratings
    const { data: ratingDist } = await supabase
      .from("reviews")
      .select("rating")
      .eq("product_id", productId);

    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: ratingDist?.filter((r) => r.rating === star).length ?? 0,
    }));

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: {
        reviews,
        distribution,
        pagination: {
          page,
          limit,
          total:      count ?? 0,
          totalPages: Math.ceil((count ?? 0) / limit),
        },
      },
    });
  } catch (error) {
    logger("Error in getProductReviews controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// POST /reviews
export const createReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const parsed = createReviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid request body",
      });
    }

    const { productId, orderId, rating, title, comment } = parsed.data;

    // تحقق إن الـ user اشترى المنتج ده فعلاً
    let verified = false;
    if (orderId) {
      const { data: orderItem } = await supabase
        .from("order_items")
        .select("id")
        .eq("order_id", orderId)
        .eq("product_id", productId)
        .maybeSingle();

      verified = !!orderItem;
    }

    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        product_id: productId,
        user_id:    userId,
        order_id:   orderId ?? null,
        rating,
        title:      title ?? null,
        comment:    comment ?? null,
        verified,
      })
      .select(
        `
        id,
        rating,
        title,
        comment,
        verified,
        created_at,
        user:users(first_name, last_name, avatar)
        `,
      )
      .single();

    if (error) {
      logger("Error creating review:", error);

      // الـ user عمل review قبل كده
      if (error.code === "23505") {
        return res.status(400).json({
          success: false,
          message: "You have already reviewed this product",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to create review",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    logger("Error in createReview controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// DELETE /reviews/:reviewId
export const deleteReview = async (
  req: Request<{ reviewId: string }>,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { reviewId } = req.params;

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId)
      .eq("user_id", userId); // الـ user يمسح بس الـ review بتاعته

    if (error) {
      logger("Error deleting review:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete review",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: null,
    });
  } catch (error) {
    logger("Error in deleteReview controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};