import type { Request } from "express";

interface RegisterRequest extends Request {
    body: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }
}

interface LoginRequest extends Request {
    body: {
        email: string;
        password: string;
    }
}


export type { RegisterRequest, LoginRequest };