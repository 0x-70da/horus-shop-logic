import { Router, Router as ExpressRouter } from "express";
import { getShippingMethods } from "./shipping.controller.js";

const router: ExpressRouter = Router();

router.get("/", getShippingMethods);

export default router;
