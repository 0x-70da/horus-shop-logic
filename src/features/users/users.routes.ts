import { Router, Router as ExpressRouter } from "express";
import { getProfile, updateProfile } from "./users.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router: ExpressRouter = Router();
router.use(authMiddleware);

router.get("/profile", getProfile);
router.patch("/profile", updateProfile);

export default router;
