import { Router, Router as ExpressRouter } from "express";
import { getPromoBanners } from "./promo.controller.js";

const router: ExpressRouter = Router();

router.get("/", getPromoBanners);

export default router;