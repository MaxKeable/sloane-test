import User from "../../../models/user";
import { GetAllUsersPayload } from "../../model/types";
import { logger } from "../../../utils/logger";

logger.info("Getting all users");

export const getUsers = async (): Promise<GetAllUsersPayload[]> => {
  const result = await User.find()
    .select("_id name email createdAt updatedAt clerkUserId")
    .lean();

  logger.info("Users fetched successfully");

  return result.map((doc) => ({
    _id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    clerkUserId: doc.clerkUserId,
  }));
};
