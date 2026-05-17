import type { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.js";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "ADMIN") {
    logger(
      "Unauthorized access attempt to admin route by user with role:",
      req.user?.role,
    );
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
