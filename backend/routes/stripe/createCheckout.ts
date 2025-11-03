// Assuming you're using Express.js
import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
import { getMe } from "../../utils/getMe";
dotenv.config();

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
const stripeURL = process.env.STRIPE_REDIRECT_URL;
const priceId = process.env.STRIPE_PRICE_ID;
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const user = await getMe(req);

    if (!user.stripeCustomerId) {
      return res.status(400).json({ error: "Stripe customer ID not found." });
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      payment_method_types: ["card"],
      customer: user.stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      return_url: stripeURL,
      allow_promotion_codes: true,
      metadata: {
        allowPromo: "true",
      },
    });

    // Return the session ID (needed for embedded checkout)
    res.json({
      clientSecret: session.client_secret,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Failed to create checkout session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
