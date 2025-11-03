import express from "express";
import Stripe from "stripe";
import { getMe } from "../../utils/getMe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-08-27.basil",
});

const router = express.Router();

interface FinalizeSubscriptionRequest {
  setupIntentId?: string;
}

interface FinalizeSubscriptionResponse {
  message: string;
  status: string;
}

interface ErrorResponse {
  error: string;
  status?: string;
}

const validateSubscriptionOwnership = (
  subscription: Stripe.Subscription,
  stripeCustomerId: string
): boolean => {
  return subscription.customer === stripeCustomerId;
};

const handleSetupIntentFlow = async (
  setupIntentId: string,
  subscriptionId: string,
  stripeCustomerId: string
): Promise<{
  success: boolean;
  paymentMethod?: Stripe.PaymentMethod;
  error?: string;
}> => {
  const setupIntent = await stripe.setupIntents.retrieve(setupIntentId, {
    expand: ["payment_method"],
  });

  if (setupIntent.status !== "succeeded" || !setupIntent.payment_method) {
    return { success: false, error: "Setup intent not completed" };
  }

  const paymentMethod = setupIntent.payment_method as Stripe.PaymentMethod;

  if (typeof paymentMethod.customer !== "string") {
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: stripeCustomerId,
    });
  }

  await stripe.subscriptions.update(subscriptionId, {
    default_payment_method: paymentMethod.id,
  });

  return { success: true, paymentMethod };
};

const validatePaymentIntentFlow = (
  subscription: Stripe.Subscription
): {
  success: boolean;
  paymentIntent?: Stripe.PaymentIntent;
  error?: string;
} => {
  const invoice = subscription.latest_invoice as Stripe.Invoice & {
    payment_intent?: Stripe.PaymentIntent;
  };

  const paymentIntent = invoice.payment_intent;

  if (paymentIntent && paymentIntent.status === "succeeded") {
    return { success: true, paymentIntent };
  }

  return {
    success: false,
    paymentIntent,
    error: "Payment not completed",
  };
};

router.post("/:subscriptionId", async (req, res) => {
  try {
    const user = await getMe(req);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!user.stripeCustomerId) {
      return res.status(400).json({ error: "Stripe customer ID not found" });
    }

    const { subscriptionId } = req.params;
    const { setupIntentId }: FinalizeSubscriptionRequest = req.body;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["latest_invoice.payment_intent"],
    });

    if (!validateSubscriptionOwnership(subscription, user.stripeCustomerId)) {
      return res
        .status(403)
        .json({ error: "Unauthorized access to subscription" });
    }

    if (setupIntentId) {
      const result = await handleSetupIntentFlow(
        setupIntentId,
        subscriptionId,
        user.stripeCustomerId
      );

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      const response: FinalizeSubscriptionResponse = {
        message: "Subscription finalized with saved payment method",
        status: subscription.status,
      };

      return res.json(response);
    }

    const paymentResult = validatePaymentIntentFlow(subscription);

    if (paymentResult.success) {
      const response: FinalizeSubscriptionResponse = {
        message: "Subscription finalized successfully",
        status: subscription.status,
      };

      return res.json(response);
    }

    const errorResponse: ErrorResponse = {
      error: paymentResult.error || "Payment not completed",
      status: paymentResult.paymentIntent?.status || "requires_action",
    };

    return res.status(400).json(errorResponse);
  } catch (error) {
    console.error("Failed to finalize subscription:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
