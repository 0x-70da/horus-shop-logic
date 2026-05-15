import { Router, Router as ExpressRouter } from "express";
import { getProducts, getProductById } from "./products.controller.js";
import { getProductReviews } from "../reviews/reviews.controller.js";

const router: ExpressRouter = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/products/:productId/reviews", getProductReviews);

export default router;
