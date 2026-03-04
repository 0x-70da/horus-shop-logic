import type { Request } from "express";

interface CartRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
    body: {
        productId?: string;
        quantity?: number;
    }
    params: {
        itemId?: string;
    }
}

export type { CartRequest };