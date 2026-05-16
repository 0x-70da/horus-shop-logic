import { Router, Router as ExpressRouter } from "express";
import { getPromoBanners, validatePromoCode } from "./promo.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router: ExpressRouter = Router();

router.get("/", getPromoBanners);
router.post("/validate", authMiddleware, validatePromoCode);

export default router;
