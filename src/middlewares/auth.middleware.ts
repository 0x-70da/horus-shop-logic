import type { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { verifyToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    try {
        const decoded = verifyToken(token) as { id: string; role: string };
        req.user = {
            id: decoded.id,
            role: decoded.role,
        };
        next();
    } catch (error) {
        logger("Error verifying token in auth middleware:", error);
        return res.status(401).json({ message: "Invalid token" });
    }
}