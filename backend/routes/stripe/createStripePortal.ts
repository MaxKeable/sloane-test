import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { getMe } from "../../utils/getMe";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-08-27.basil",
});

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("Creating Stripe portal session");
    const user = await getMe(req);

    if (!user.stripeCustomerId) {
      return res.status(400).json({ error: "Stripe customer ID not found." });
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `http://localhost:3000/account`, // Redirect after portal actions
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating portal session:", error);
    res.status(500).json({ error: "Failed to create Stripe portal session" });
  }
});

export default router;
