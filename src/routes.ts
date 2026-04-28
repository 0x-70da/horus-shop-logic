import { Router ,Router as ExpressRouter } from "express";
import productsRouter from "./features/products/products.routes.js";
import authRouter from "./features/auth/auth.routes.js";
import usersRouter from "./features/users/users.routes.js";
import cartRouter from "./features/cart/cart.routes.js";
import wishlistRouter from "./features/wishlist/wishlist.routes.js";
import categoriesRouter from "./features/categories/categories.routes.js";
import ordersRouter from "./features/orders/orders.routes.js";
import brandsRouter from "./features/brands/brands.routes.js";

const router: ExpressRouter = Router();

router.use("/products", productsRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/cart", cartRouter);
router.use("/orders", ordersRouter);
router.use("/wishlist", wishlistRouter);
router.use("/categories", categoriesRouter);
router.use("/brands", brandsRouter);

export default router;
