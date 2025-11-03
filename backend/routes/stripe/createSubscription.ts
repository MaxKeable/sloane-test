import express from "express";
import Stripe from "stripe";
import { getMe } from "../../utils/getMe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-08-27.basil",
});

const router = express.Router();

interface CreateSubscriptionRequest {
  promoCode?: string;
  country?: string;
}

interface SubscriptionResponse {
  clientSecret?: string;
  setupClientSecret?: string;
  subscriptionId: string;
  requiresPayment: boolean;
  requiresSetup: boolean;
}

const validatePromoCode = async (promoCode: string): Promise<string> => {
  try {
    const promotionCodes = await stripe.promotionCodes.list({
      code: promoCode,
      active: true,
      limit: 1,
    });

    if (promotionCodes.data.length > 0) {
      return promotionCodes.data[0].coupon.id;
    }

    const coupon = await stripe.coupons.retrieve(promoCode);
    return coupon.id;
  } catch (error) {
    throw new Error("Invalid promo code");
  }
};

const createSubscriptionOptions = (
  stripeCustomerId: string,
  country: string,
  couponId?: string
): Stripe.SubscriptionCreateParams => {
  const options: Stripe.SubscriptionCreateParams = {
    customer: stripeCustomerId,
    items: [{ price: process.env.STRIPE_PRICE_ID }],
    payment_behavior: "default_incomplete",
    payment_settings: {
      save_default_payment_method: "on_subscription",
      payment_method_types: ["card"],
      payment_method_options: {
        card: {
          request_three_d_secure: "automatic",
        },
      },
    },
    expand: ["latest_invoice.payment_intent"],
    trial_period_days: 14,
    metadata: {
      country,
    },
    ...(couponId && { coupon: couponId }),
  };

  return options;
};

const handlePaymentFlow = async (
  subscription: Stripe.Subscription,
  stripeCustomerId: string
): Promise<SubscriptionResponse> => {
  const invoice = subscription.latest_invoice as Stripe.Invoice & {
    payment_intent?: Stripe.PaymentIntent;
  };

  if (invoice.payment_intent) {
    const paymentIntent = invoice.payment_intent;
    return {
      clientSecret: paymentIntent.client_secret ?? "",
      subscriptionId: subscription.id,
      requiresPayment: true,
      requiresSetup: false,
    };
  }

  const setupIntent = await stripe.setupIntents.create({
    customer: stripeCustomerId,
    payment_method_types: ["card"],
    usage: "off_session",
    metadata: {
      purpose: "subscription_payment_method_collection",
      subscriptionId: subscription.id,
    },
  });

  return {
    setupClientSecret: setupIntent.client_secret ?? "",
    subscriptionId: subscription.id,
    requiresPayment: true,
    requiresSetup: true,
  };
};

router.post("/", async (req, res) => {
  try {
    const user = await getMe(req);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!user.stripeCustomerId) {
      return res.status(400).json({ error: "Stripe customer ID not found" });
    }

    const { promoCode, country = "US" }: CreateSubscriptionRequest = req.body;

    let couponId: string | undefined;
    if (promoCode) {
      try {
        couponId = await validatePromoCode(promoCode);
      } catch (error) {
        return res.status(400).json({ error: "Invalid promo code" });
      }
    }

    const subscriptionOptions = createSubscriptionOptions(
      user.stripeCustomerId,
      country,
      couponId
    );

    const subscription = await stripe.subscriptions.create(subscriptionOptions);
    const response = await handlePaymentFlow(
      subscription,
      user.stripeCustomerId
    );

    return res.json(response);
  } catch (error) {
    console.error("Failed to create subscription:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
