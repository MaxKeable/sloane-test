import User from "../models/user";
import getUserIdFromBearer from "./getUserIdFromBearer";
import { Request } from "express";

export const getUser = async (req: Request, userId?: string) => {
  const user = userId
    ? await User.findOne({ clerkUserId: userId })
    : await User.findOne({ clerkUserId: getUserIdFromBearer(req) });

  if (!user) {
    return null;
  }

  return user;
};
