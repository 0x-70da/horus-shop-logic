import { Router, Router as ExpressRouter } from "express";
import { getTaxRates } from "./tax.controller.js";

const router: ExpressRouter = Router();

router.get("/", getTaxRates);

export default router;