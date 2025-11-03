import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

export const checkUserSubscription = async (stripeCustomerId: string) => {
  if (!stripeCustomerId) {
    throw new Error("Stripe Customer ID is required.");
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return;
  }
  const stripe = new Stripe(stripeKey, {
    apiVersion: "2025-08-27.basil",
  });

  const subscriptions = await stripe.subscriptions.list({
    customer: stripeCustomerId,
    status: "all",
    limit: 10, // Adjust based on your needs
  });

  // Check if there is at least one active or trialing subscription
  const hasActiveSubscription = subscriptions.data.some((subscription) =>
    ["active", "trialing"].includes(subscription.status)
  );

  return hasActiveSubscription;
};
