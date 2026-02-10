import { Router, Router as ExpressRouter } from "express";

const router: ExpressRouter = Router();

router.post("/register", (await import("./auth.controller.js")).register);
router.post("/login", (await import("./auth.controller.js")).login);

export default router;