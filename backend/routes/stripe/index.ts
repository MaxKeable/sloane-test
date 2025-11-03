import express from "express";
import createCheckout from "./createCheckout";
import checkSubscription from "./checkSubscription";
import createSubscription from "./createSubscription";
import finalizeSubscription from "./finalizeSubscription";
import createStripePortal from "./createStripePortal";
import checkPromocode from "./checkPromocode";

const router = express.Router();

router.use("/create-checkout", createCheckout);
router.use("/check-subscription", checkSubscription);
router.use("/create-subscription", createSubscription);
router.use("/finalize-subscription", finalizeSubscription);
router.use("/create-stripe-portal", createStripePortal);
router.use("/validate-promo", checkPromocode);

export default router;