import type { CookieOptions, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const BASE_COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
}

export const setAccessTokenCookie = (res: Response, token: string) => {
    res.cookie("access_token", token, {
        ...BASE_COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000,
    })
}

export const setRefreshTokenCookie = (res: Response, token: string) => {
    res.cookie("refresh_token", token, {
        ...BASE_COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        // path: "/api/auth/refresh/",
    })
}

export const clearAuthCookies = (res: Response) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token"/*, { path: "/api/auth/refresh/" }*/);
}