import { Router, Router as ExpressRouter } from "express";
import { getProfile } from "./auth.controller.js";

const router: ExpressRouter = Router();

router.get("/profile", getProfile);

export default router;