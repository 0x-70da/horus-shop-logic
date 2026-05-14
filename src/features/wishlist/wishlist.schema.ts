import z from "zod";

export const wishlistItemsSchema = z.object({
  itemId: z.string(),
});

export type WishlistItemInputs = z.infer<typeof wishlistItemsSchema>;