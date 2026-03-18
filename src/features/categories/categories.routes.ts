import { Router, Router as ExpressRouter } from "express";
import { getAllCategories, getProductsByCategory } from "./categories.controller.js";

const router: ExpressRouter = Router();

router.get("/", getAllCategories);
router.get("/:slug", getProductsByCategory);

export default router;