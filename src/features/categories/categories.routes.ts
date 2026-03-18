import { Router, Router as ExpressRouter } from "express";
import { getAllCategories } from "./categories.controller.js";

const router: ExpressRouter = Router();

router.get("/", getAllCategories);
router.get("/:slug", getProductsByCategory);

export default router;