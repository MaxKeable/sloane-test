import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

export interface SubscriptionDetails {
  isActive: boolean;
  status: string | null;
  plan: string | null;
  currentPeriodEnd: Date | null;
  trialEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

export const getUserSubscriptionDetails = async (
  stripeCustomerId: string
): Promise<SubscriptionDetails> => {
  const defaultResponse: SubscriptionDetails = {
    isActive: false,
    status: null,
    plan: null,
    currentPeriodEnd: null,
    trialEnd: null,
    cancelAtPeriodEnd: false,
  };

  if (!stripeCustomerId) {
    return defaultResponse;
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    console.warn("STRIPE_SECRET_KEY not found in environment");
    return defaultResponse;
  }

  try {
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "all",
      limit: 10,
    });

    // Get the most recent active or trialing subscription
    const activeSubscription = subscriptions.data.find((subscription) =>
      ["active", "trialing"].includes(subscription.status)
    );

    if (!activeSubscription) {
      // Check for recently canceled subscription to show expiry info
      const canceledSubscription = subscriptions.data.find(
        (subscription) => subscription.status === "canceled"
      );

      if (canceledSubscription) {
        return {
          isActive: false,
          status: "canceled",
          plan: canceledSubscription.items.data[0]?.price.nickname || null,
          currentPeriodEnd: canceledSubscription.current_period_end
            ? new Date(canceledSubscription.current_period_end * 1000)
            : null,
          trialEnd: null,
          cancelAtPeriodEnd: false,
        };
      }

      return defaultResponse;
    }

    return {
      isActive: true,
      status: activeSubscription.status,
      plan: activeSubscription.items.data[0]?.price.nickname || "Standard Plan",
      currentPeriodEnd: activeSubscription.current_period_end
        ? new Date(activeSubscription.current_period_end * 1000)
        : null,
      trialEnd: activeSubscription.trial_end
        ? new Date(activeSubscription.trial_end * 1000)
        : null,
      cancelAtPeriodEnd: activeSubscription.cancel_at_period_end,
    };
  } catch (error) {
    console.error("Error fetching subscription details:", error);
    return defaultResponse;
  }
};
