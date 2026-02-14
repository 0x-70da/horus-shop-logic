import { Router, Router as ExpressRouter } from "express";
import { addToWishlist, getWishlist, removeFromWishlist } from "./wishlist.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router: ExpressRouter = Router();

router.use(authMiddleware);

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.delete("/:id", removeFromWishlist);

export default router;