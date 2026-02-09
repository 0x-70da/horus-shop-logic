import { Router ,Router as ExpressRouter } from "express";
import { authMiddleware } from "./middlewares/auth.middleware.js";
// import authRoutes from "./features/auth/auth.routes";
// import productRoutes from "./features/products/products.routes";

const router: ExpressRouter = Router();

// router.use("/auth", authRoutes);
// router.use("/products", productRoutes);
router.use("/auth",authMiddleware , (await import("./features/auth/auth.routes.js")).default);

export default router;
