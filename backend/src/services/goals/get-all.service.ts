import { logger } from "../../../utils/logger";
import prisma from "../../../config/client";
import { UserGoals } from "../../model/types";

logger.info("Getting all goals");

export const getGoals = async (clerkUserId: string): Promise<UserGoals> => {
  const result = await prisma.usergoals.findUnique({
    where: { userId: clerkUserId },
    include: {
      monthlyGoals: true,
      weeklyGoals: true,
    },
  });

  if (!result) {
    return await prisma.usergoals.create({
      data: {
        userId: clerkUserId,
        monthlyGoals: [],
        weeklyGoals: [],
        isEnabled: true,
        v: 0,
      },
    });
  }

  return result;
};
