// orders.schema.ts
import { z } from "zod";

export const createOrderSchema = z.object({
  addressId: z.string(),
  shippingMethodId: z.string(),
  promoCode: z.string().trim().min(1).optional(),
  paymentMethod: z.enum([
    "credit_card",
    "cash_on_delivery",
    "vodafone_cash"
  ]),
  notes: z.string().max(500).optional(),
});

export const getOrdersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  status: z.enum([
    "pending", "confirmed", "processing",
    "shipped", "delivered", "cancelled", "refunded"
  ]).optional(),
});

export type CreateOrderBody = z.infer<typeof createOrderSchema>;
export type GetOrdersQuery = z.infer<typeof getOrdersQuerySchema>;