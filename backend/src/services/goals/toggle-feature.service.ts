import prisma from "../../../config/client";
import { UserGoals } from "../../model/types";

export const toggleGoalsFeature = async (
  clerkUserId: string
): Promise<UserGoals> => {
  const userGoals = await prisma.usergoals.findUnique({
    where: { userId: clerkUserId },
  });
  if (!userGoals) {
    throw new Error("Goals not found");
  }

  const result = await prisma.usergoals.update({
    where: { userId: clerkUserId },
    data: { isEnabled: !userGoals.isEnabled },
  });

  return result;
};
