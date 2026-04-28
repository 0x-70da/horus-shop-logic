import { Router, Router as ExpressRouter } from "express";
import { getAllBrands } from "./brands.controller.js";

const router: ExpressRouter = Router();

router.get("/", getAllBrands);

export default router;