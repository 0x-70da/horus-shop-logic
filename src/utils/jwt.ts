import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (payload: JwtPayload, expiresIn: SignOptions["expiresIn"] = "1h"): string => {
    return jwt.sign(payload, process.env.JWT_SECRET! as string, { expiresIn });
}

export const verifyToken = (token: string): JwtPayload | string => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
        throw new Error("Invalid token");
    }
}