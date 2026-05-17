import { Router, Router as ExpressRouter } from "express";
import { getFlashDeals } from "./flash.controller.js";

const router: ExpressRouter = Router();

router.get("/", getFlashDeals);

export default router;
