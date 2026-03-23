import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import type { MyJwtPayload } from "../types/jwt.types.js";
dotenv.config();

export const generateAccessToken = (payload: JwtPayload, expiresIn: SignOptions["expiresIn"] = "15m"): string => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET! as string, { expiresIn });
}

export const generateRefreshToken = (payload: JwtPayload, expiresIn: SignOptions["expiresIn"] = "7d"): string => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET! as string, { expiresIn });
}

export const verifyAccessToken = (token: string): MyJwtPayload => {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
    if (typeof decoded === "string") {
        throw new Error("Invalid access token payload");
    }
    return decoded as MyJwtPayload;
}

export const verifyRefreshToken = (token: string): MyJwtPayload => {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
    if (typeof decoded === "string") {
        throw new Error("Invalid refresh token payload");
    }
    return decoded as MyJwtPayload;
}