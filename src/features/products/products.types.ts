interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    short_description?: string;
    price: number;
    original_price?: number;
    rating?: number;
    reviews_count?: number;
    stock: number;
    category_id?: string;
    subcategory_id?: string;
    brand_id?: string;
    featured?: boolean;
    bestseller?: boolean;
    new_arrival?: boolean;
    tags?: string[];
    images?: string[];
    specs?: Record<string, string>;
    created_at: string;
}

export type { Product };