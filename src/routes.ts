import { Router ,Router as ExpressRouter } from "express";
import productsRouter from "./features/products/products.routes.js";
import authRouter from "./features/auth/auth.routes.js";
import usersRouter from "./features/users/users.routes.js";
import cartRouter from "./features/cart/cart.routes.js";
import wishlistRouter from "./features/wishlist/wishlist.routes.js";
import categoryRouter from "./features/category/category.routes.js";

const router: ExpressRouter = Router();

router.use("/products", productsRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/cart", cartRouter);
router.use("/wishlist", wishlistRouter);
router.use("/category", categoryRouter);

export default router;
