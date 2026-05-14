import express from "express";
import {
  cancelOrder,
  createOrder,
  getAllOrders,
  getOrderById,
} from "./orders.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router: express.Router = express.Router();

router.use(authMiddleware);

router.get("/", getAllOrders);
router.post("/", createOrder);
router.get("/:orderId", getOrderById);
router.patch("/:orderId/cancel", cancelOrder);

export default router;
