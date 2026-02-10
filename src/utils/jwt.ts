import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (payload: object, expiresIn: string | number = "1h"): string => {
    return jwt.sign(payload, process.env.JWT_SECRET! as string, { expiresIn });
}

export const verifyToken = (token: string): object | string => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
        throw new Error("Invalid token");
    }
}