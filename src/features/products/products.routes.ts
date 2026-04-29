import { Router, Router as ExpressRouter } from "express";
import { getProducts, getProductById } from "./products.controller.js";

const router: ExpressRouter = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

export default router;
