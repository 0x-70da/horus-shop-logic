import { Router, Router as ExpressRouter } from "express";
import { getAllProducts, getProductBySlug } from "./products.controllers.js";

const router: ExpressRouter = Router();

router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);

export default router;