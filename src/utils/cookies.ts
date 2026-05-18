import type { CookieOptions, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const BASE_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  // Cross-site cookies (separate frontend/backend origins) require:
  // SameSite=None + Secure in production.
  secure: IS_PRODUCTION,
  sameSite: IS_PRODUCTION ? "none" : "lax",
  path: "/",
};

export const setAccessTokenCookie = (res: Response, token: string) => {
  res.cookie("access_token", token, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 15 * 60 * 1000,
  });
};

export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie("refresh_token", token, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    // path: "/api/auth/refresh/",
  });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("access_token", BASE_COOKIE_OPTIONS);
  res.clearCookie("refresh_token", BASE_COOKIE_OPTIONS);
};
