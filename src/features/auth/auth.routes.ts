import { Router, Router as ExpressRouter } from "express";
import { register, login, refresh, me, logout } from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router: ExpressRouter = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.get("/me", authMiddleware, me);
router.post("/logout", authMiddleware, logout);

export default router;