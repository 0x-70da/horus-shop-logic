import { Router, Router as ExpressRouter } from "express";
import { getAllUsers, getProfile, updateProfile } from "./users.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router: ExpressRouter = Router();
router.use(authMiddleware);

router.get("/profile", getProfile);
router.patch("/profile", updateProfile);

// admin
router.get("/", adminMiddleware, getAllUsers);

export default router;