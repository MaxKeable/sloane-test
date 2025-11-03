import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-08-27.basil",
});

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the entire request body
    const { promoCode } = req.body;

    // Check if STRIPE_SECRET_KEY is set
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return res.status(500).json({
        success: false,
        message: "Stripe configuration error",
      });
    }

    if (!promoCode) {
      console.log("No promo code provided");
      return res.status(400).json({
        success: false,
        message: "Promo code is required",
      });
    }

    console.log("Attempting to validate promo code:", promoCode);

    try {
      // First, try to retrieve the coupon directly
      const coupon = await stripe.coupons.retrieve(promoCode);
      console.log("Found coupon:", coupon);

      return res.json({
        success: true,
        data: {
          couponId: coupon.id,
          percentOff: coupon.percent_off,
          amountOff: coupon.amount_off,
          currency: coupon.currency,
          valid: true,
        },
      });
    } catch (couponError) {
      console.log("Coupon not found, trying promotion codes...");

      // If coupon lookup fails, try promotion codes
      const promotionCodes = await stripe.promotionCodes.list({
        code: promoCode,
        active: true,
        limit: 1,
      });

      console.log("Promotion codes response:", promotionCodes);

      if (promotionCodes.data.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Invalid or expired promo code",
        });
      }

      const promoDetails = promotionCodes.data[0];
      return res.json({
        success: true,
        data: {
          couponId: promoDetails.coupon.id,
          percentOff: promoDetails.coupon.percent_off,
          amountOff: promoDetails.coupon.amount_off,
          currency: promoDetails.coupon.currency,
          valid: true,
        },
      });
    }
  } catch (error) {
    console.error("Validation error details:", error);

    // Check if it's a Stripe error
    if (error instanceof Stripe.errors.StripeError) {
      console.error("Stripe error type:", error.type);
      return res.status(400).json({
        success: false,
        message: `Stripe error: ${error.message}`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while validating promo code",
    });
  }
});

export default router;
