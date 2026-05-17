import z from "zod";

export const cartItemsSchema = z.object({
  itemId: z.string(),
  variantId: z.string().nullable(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export const updateOrRemoveCartSchema = z.object({
  itemId: z.string(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export type CartItemInputs = z.infer<typeof cartItemsSchema>;
export type UpdateCartInputs = z.infer<typeof updateOrRemoveCartSchema>;
