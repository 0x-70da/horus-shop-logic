import type { Request, Response } from "express";
import { constructStripeWebhookEvent } from "./stripe.service.js";
import { supabase } from "../../config/supabase.js";
import logger from "../../utils/logger.js";

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;

  try {
    const event = constructStripeWebhookEvent(req.body, signature);

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;

        const { error } = await supabase.rpc("update_order_status", {
          p_order_id: orderId!,
          p_status: "confirmed",
        });

        if (error) {
          logger("Failed to update order status from Stripe webhook:", {
            orderId,
            error,
          });
          return res.status(500).json({
            success: false,
            message: "Failed to update order status",
          });
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;

        logger("Payment failed for order:", orderId);
        break;
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    logger("Webhook error:", error);
    return res.status(400).json({ success: false, message: "Webhook failed" });
  }
};
