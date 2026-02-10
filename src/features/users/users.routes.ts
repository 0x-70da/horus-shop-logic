import { Router, Router as ExpressRouter } from "express";
import { getAllUsers, getProfile, updateProfile } from "./users.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router: ExpressRouter = Router();

router.get("/me", authMiddleware, getProfile);
router.patch("/me", authMiddleware, updateProfile);

// admin
router.get("/", authMiddleware, adminMiddleware, getAllUsers);

export default router;