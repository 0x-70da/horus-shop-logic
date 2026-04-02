export type SortBy = "price" | "newest" | "popularity" | "rating";

export type SortOrder = "asc" | "desc";

export interface GetProductsQuery {
    category?: string;
    subcategory?: string;
    sortBy?: SortBy;
    sortOrder?: SortOrder;
    page?: string;
    limit?: string;
}