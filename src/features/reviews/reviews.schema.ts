import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  orderId:   z.string().uuid("Invalid order ID").optional(),
  rating:    z.number().int().min(1).max(5),
  title:     z.string().max(100).optional(),
  comment:   z.string().max(1000).optional(),
});

export const getReviewsQuerySchema = z.object({
  page:   z.coerce.number().int().positive().default(1),
  limit:  z.coerce.number().int().positive().max(50).default(10),
  rating: z.coerce.number().int().min(1).max(5).optional(),
});

export type CreateReviewRequest = z.infer<typeof createReviewSchema>;