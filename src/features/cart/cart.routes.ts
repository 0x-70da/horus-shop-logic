import { Router, Router as ExpressRouter } from "express";
import { addToCart, clearCart, getCart, removeFromCart, updateCartItem } from "./cart.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router: ExpressRouter = Router();

router.use(authMiddleware); 

router.get("/", getCart);
router.post("/", addToCart);
router.patch("/:itemId", updateCartItem);
router.delete("/:itemId", removeFromCart);
router.delete("/", clearCart);

export default router;