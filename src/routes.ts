import { Router ,Router as ExpressRouter } from "express";

const router: ExpressRouter = Router();

router.use("/products", (await import("./features/products/products.routes.js")).default);
router.use("/auth", (await import("./features/auth/auth.routes.js")).default);
router.use("/users", (await import("./features/users/users.routes.js")).default);
router.use("/cart", (await import("./features/cart/cart.routes.js")).default);
router.use("/wishlist", (await import("./features/wishlist/wishlist.routes.js")).default);
router.use("/category", (await import("./features/category/category.routes.js")).default);

export default router;
