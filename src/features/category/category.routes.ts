import { Router, Router as ExpressRouter } from "express";
import { getAllCategories } from "./category.controller.js";

const router: ExpressRouter = Router();

router.get("/", getAllCategories);

export default router;