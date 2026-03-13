import type { Request } from "express";

interface UserRequest extends Request {
    user?: {
        id: string;
        role: string;
    }
}

export type { UserRequest };