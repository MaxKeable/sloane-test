import express, { Request, Response } from "express";
import User from "../models/user"; // Adjust the path to where your User model is located
import { createStripeCustomer } from "../utils/createStripeCustomer";
import dotenv from "dotenv";
import { clerkClient } from "@clerk/express";

dotenv.config();

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    // Destructure the req.body to get user information
    const { name, email, businessProfile } = req.body;

    // Create a random password (for demonstration; in real scenarios, get it from user or generate more securely)
    const startingPassword = "AIHub!123";

    // Create a user in Clerk
    // Note: Adjust the following to match Clerk's SDK usage for creating a user
    const clerkUser = await clerkClient.users.createUser({
      firstName: name,
      emailAddress: [email],
      password: startingPassword, // This may need to be adjusted based on Clerk's requirements
      // Add any other required fields by Clerk
    });

    // Create the user in Stripe
    const stripeCustomerId: string | undefined = await createStripeCustomer(
      email,
      name
    );

    // Create the user in MongoDB
    const newUser = new User({
      name,
      email,
      businessProfile,
      clerkUserId: clerkUser.id,
      stripeCustomerId,
      // Any additional fields you need to store in MongoDB
    });

    // Save the new user
    await newUser.save();

    // Retrieve user details from your database
    if (!stripeCustomerId) {
      return res.status(400).json({ error: "Stripe customer ID not found." });
    }

    console.log({ stripeCustomerId });
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: stripeCustomerId,
      line_items: [
        {
          price: "price_1PLbtUKYNGRKelfXJXc7hEv0",
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: "https://www.sloane.biz/booking",
      // success_url: stripeURL,
      cancel_url: "https://www.sloane.biz",
      allow_promotion_codes: true,
    });

    // Send back a response
    // Note: Adjust what you send back as a response based on your application's needs
    res.status(200).json({
      message: "User created successfully",
      userId: newUser._id,
      clerkUserId: clerkUser.id,
      redirectUrl: session.url,
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
