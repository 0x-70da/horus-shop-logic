import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

interface CreatePaymentIntent {
  amount: number;
  currency: string;
  orderId: string;
  userId: string;
}

export const createPaymentIntent = async ({
  amount,
  currency = "egp",
  orderId,
  userId,
}: CreatePaymentIntent) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata: {
      orderId,
      userId,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
  };
};

export const constructStripeWebhookEvent = (
  payload: Buffer,
  signature: string,
) => {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );
};
