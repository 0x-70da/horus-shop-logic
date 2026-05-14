import { Router, Router as ExpressRouter } from "express";
import { getAllUsers } from "./admin.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router: ExpressRouter = Router();

router.use(authMiddleware, adminMiddleware);

router.get("/users", getAllUsers);

export default router;