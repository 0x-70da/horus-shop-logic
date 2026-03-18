import { Router, Router as ExpressRouter } from "express";
import { getAllProducts, getProductBySlug, getProductsByCategory } from "./products.controller.js";

const router: ExpressRouter = Router();

router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);
router.get("/:slug", getProductsByCategory);

export default router;
