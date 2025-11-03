import express from "express";
import User from "../../models/user";
import { createStripeCustomer } from "../../utils/createStripeCustomer";

const router = express.Router();

type ClerkEvent = "user.created" | "user.deleted" | "user.updated";
type UserCreatedPayload = {
  id: string;
  email_addresses: {
    email_address: string;
  }[];
  first_name?: string;
  last_name?: string;
};

router.post("/", (req, res) => {
  const { data, type }: { data: unknown; type: ClerkEvent } = req.body;

  switch (type) {
    case "user.created":
      createUser(data as UserCreatedPayload);
      break;
    case "user.deleted":
      deleteUser(data);
      break;
    case "user.updated":
      updateUser(data);
      break;
    default:
      break;
  }

  res.sendStatus(200);
});

const createUser = async (data: UserCreatedPayload) => {
  try {
    const stripeCustomerId: string | undefined = await createStripeCustomer(
      data.email_addresses[0].email_address,
      data.first_name + " " + data.last_name
    );

    const user = await User.create({
      clerkUserId: data.id,
      name: data.first_name + " " + data.last_name,
      email: data.email_addresses[0].email_address,
      stripeCustomerId,
      // Onboarding is now optional - users start with no progress
    });
    return user;
  } catch (error) {
    console.error("Error creating user from clerk", error);
  }
};

const updateUser = async (data: any) => {
  try {
    const user = await User.findOneAndUpdate(
      { clerkUserId: data.id },
      {
        clerkUserId: data.id,
        email: data.email_addresses[0].email_address,
      }
    );
    return user;
  } catch (error) {
    console.error("Error updating user from clerk", error);
  }
};

const deleteUser = async (data: any) => {
  try {
    const user = await User.findOneAndDelete({ clerkUserId: data.id });
    return user;
  } catch (error) {
    console.error("Error deleting user from clerk", error);
  }
};

export default router;
