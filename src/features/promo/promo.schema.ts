import { z } from "zod";

export const promoCodeSchema = z.object({
  code: z.string().min(1, "Promo code is required"),
  orderTotal: z.coerce
    .number()
    .positive("Order total must be a positive number"),
});

export type PromoCodeValidationRequest = z.infer<typeof promoCodeSchema>;
