import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { handleStripeWebhook } from "./stripe.webhook.js";

const router: express.Router = express.Router();

router.use(authMiddleware);

router.post("/stripe/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

export default router;