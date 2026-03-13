import type { Request } from "express";

interface WishListRequest extends Request {
    user?: {
        id: string;
        role: string;
    },
    body: {
        productId?: string;
    },
    params: {
        productId?: string;
    }
}

export type { WishListRequest };