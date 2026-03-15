import { Router, Router as ExpressRouter } from "express";
import { getAllProducts, getProductBySlug, getProductByCategory } from "./products.controller.js";

const router: ExpressRouter = Router();

router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);
router.get("/:slug", getProductByCategory);

export default router;
