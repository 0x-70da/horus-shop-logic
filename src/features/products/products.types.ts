import type { ReplaceKey } from "../../types/general.types.js";

export type SortBy = "price" | "newest" | "popularity" | "rating";

export type SortOrder = "asc" | "desc";

export interface GetProductsQuery {
    category?: string;
    subcategory?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sortBy?: SortBy;
    sortOrder?: SortOrder;
    page?: string;
    limit?: string;
}

export type ValidatedGetProductsQuery = ReplaceKey<GetProductsQuery, 'page' | 'limit', number>;