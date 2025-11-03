import { Request } from "express";
import getUserIdFromBearer from "../../utils/getUserIdFromBearer";
import User from "../../models/user";
import type { RequestContext } from "../model/types";

export const getClerkId = (req: Request): string | null => {
  return getUserIdFromBearer(req);
};

export const createRequestContext = async ({
  req,
}: {
  req: Request;
}): Promise<RequestContext> => {
  const clerkUserId = getClerkId(req);
  let user: RequestContext["user"] = null;

  if (clerkUserId) {
    try {
      const userDoc = await User.findOne({ clerkUserId: clerkUserId });
      if (userDoc) {
        user = {
          ...userDoc,
          clerkUserId: userDoc.clerkUserId,
          email: userDoc.email,
          businessProfile: userDoc.businessProfile,
          createdAt: userDoc.createdAt,
          updatedAt: userDoc.updatedAt,
        };
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  return {
    clerkUserId,
    user,
    isAuthenticated: !!clerkUserId,
  };
};
