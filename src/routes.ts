import { Router, Router as ExpressRouter } from "express";
import productsRouter from "./features/products/products.routes.js";
import authRouter from "./features/auth/auth.routes.js";
import usersRouter from "./features/users/users.routes.js";
import cartRouter from "./features/cart/cart.routes.js";
import wishlistRouter from "./features/wishlist/wishlist.routes.js";
import categoriesRouter from "./features/categories/categories.routes.js";
import ordersRouter from "./features/orders/orders.routes.js";
import brandsRouter from "./features/brands/brands.routes.js";
import promoRouter from "./features/promo/promo.routes.js";
import flashRouter from "./features/flash/flash.routes.js";
import adminRouter from "./features/admin/admin.routes.js";
import shippingRouter from "./features/shipping/shipping.routes.js";
import reviewsRouter from "./features/reviews/reviews.routes.js";
import taxRouter from "./features/tax/tax.route.js";
import addressesRouter from "./features/addresses/addresses.routes.js";

const router: ExpressRouter = Router();

router.use("/products", productsRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/cart", cartRouter);
router.use("/orders", ordersRouter);
router.use("/wishlist", wishlistRouter);
router.use("/categories", categoriesRouter);
router.use("/promo", promoRouter);
router.use("/flash", flashRouter);
router.use("/brands", brandsRouter);
router.use("/admin", adminRouter);
router.use("/shipping-methods", shippingRouter);
router.use("/reviews", reviewsRouter);
router.use("/tax", taxRouter);
router.use("/addresses", addressesRouter);

export default router;
