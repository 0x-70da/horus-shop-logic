import { z } from "zod";

export const getProductsQuerySchema = z.object({
    category: z.string().optional(),
    subcategory: z.string().optional(),
    brand: z.string().optional(),

    minPrice: z.coerce.number({error: "minPrice must be a number"}).min(0, { error: "minPrice must be a positive number" }).optional(),
    maxPrice: z.coerce.number({error: "maxPrice must be a number"}).min(0, { error: "maxPrice must be a positive number" }).optional(),

    inStock: z.enum(["true", "false"], { error: "inStock must be either 'true' or 'false'" }).optional(),
    sortBy: z.enum(["price", "newest", "popularity", "rating"], { error: "sortBy must be one of the allowed values" }).default("newest"),
    sortOrder: z.enum(["asc", "desc"], { error: "sortOrder must be either 'asc' or 'desc'" }).default("desc"),
    page: z.coerce.number({error: "page must be a number"}).int({error: "page must be an integer"}).min(1, { error: "page must be a positive integer" }).default(1),
    limit: z.coerce.number({error: "limit must be a number"}).int({error: "limit must be an integer"}).min(1, { error: "limit must be a positive integer" }).max(50, { error: "limit must be a positive integer less than or equal to 50" }).default(20),
}).refine((data) => {
    if ( data.minPrice && data.maxPrice ) {
        return data.minPrice <= data.maxPrice;
    }
    return true;
}, { error: "minPrice must be less than or equal to maxPrice" });

export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>;