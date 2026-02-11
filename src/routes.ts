import { Router ,Router as ExpressRouter } from "express";

const router: ExpressRouter = Router();

router.use("/products", (await import("./features/products/products.routes.js")).default);
router.use("/auth", (await import("./features/auth/auth.routes.js")).default);
router.use("/users", (await import("./features/users/users.routes.js")).default);

export default router;
