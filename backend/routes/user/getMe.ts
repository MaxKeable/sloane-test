import express, { Request, Response } from "express";
import { getMe } from "../../utils/getMe";
import { getUserSubscriptionDetails } from "../../utils/getUserSubscriptionDetails";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const user = await getMe(req);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch subscription details if user has Stripe customer ID
    const subscription = user.stripeCustomerId
      ? await getUserSubscriptionDetails(user.stripeCustomerId)
      : {
          isActive: false,
          status: null,
          plan: null,
          currentPeriodEnd: null,
          trialEnd: null,
          cancelAtPeriodEnd: false,
        };

    // Combine user data with subscription details
    const userWithSubscription = {
      ...user.toObject(), // Convert Mongoose document to plain object
      subscription,
    };

    res.status(200).json(userWithSubscription);
  } catch (error) {
    console.error("Error in getMe route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
