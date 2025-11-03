import User from "../models/user";
import getUserIdFromBearer from "./getUserIdFromBearer";
import { Request } from "express";

export const getMe = async (req: Request) => {
  const userId = getUserIdFromBearer(req);

  const user = await User.findOne({ clerkUserId: userId });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
