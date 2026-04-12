import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;

    if (!token) {
        logger("Access token missing in request");
        return res.status(401).json({ message: "Access Token Missing" });
    }

    try {
        const decoded = verifyAccessToken(token);
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