export interface GetProductsQuery {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: "true" | "false";
  sortBy?: "price" | "newest" | "popularity" | "rating";
  sortOrder?: "asc" | "desc";
  page?: string;
  limit?: string;
}
