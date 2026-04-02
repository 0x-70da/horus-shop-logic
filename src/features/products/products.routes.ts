import { Router, Router as ExpressRouter } from "express";
import { getProducts, getProductBySlug } from "./products.controller.js";

const router: ExpressRouter = Router();

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

export default router;
