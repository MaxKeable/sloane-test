/* eslint-disable max-len */
import Stripe from "stripe";

export const createStripeCustomer = async (email: string, name: string) => {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return;
    }
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });
    const customer = await stripe.customers.create({
      email,
      name,
    });
    return customer.id; // Return the Stripe customer ID to store in Firestore
  } catch (err: any) {
    console.error(err);
    return;
  }
};
