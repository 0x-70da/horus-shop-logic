import type { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    try {
        const decoded = verifyToken(token) as { id: string; role: string };
        (req as any).user = {
            id: decoded.id,
            role: decoded.role,
        };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}