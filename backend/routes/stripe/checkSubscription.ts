// Assuming you're using Express.js
import express from "express";
import getUserIdFromBearer from "../../utils/getUserIdFromBearer";
import User from "../../models/user";
import { checkUserSubscription } from "../../utils/checkUserSubscription";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const userId = getUserIdFromBearer(req);
    console.log("userId", userId);

    // Retrieve user details from your database
    const user = await User.findOne({ clerkUserId: userId });

    if (!user?.stripeCustomerId) {
      return res.status(400).json({ error: "Stripe customer ID not found." });
    }

    const isActiveSubscription = await checkUserSubscription(
      user.stripeCustomerId
    );

    res.status(200).json({ isActiveSubscription });
  } catch (error) {
    console.error("Failed to create checkout session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
