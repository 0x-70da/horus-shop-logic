import { Router, Router as ExpressRouter } from "express";
import { createReview, deleteReview } from "./reviews.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router: ExpressRouter = Router();

router.post("/reviews", authMiddleware, createReview);
router.delete("/reviews/:reviewId", authMiddleware, deleteReview);

export default router;