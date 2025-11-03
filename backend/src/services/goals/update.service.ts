import {
  UpdateGoalsRequest,
  UserGoals as UserGoalsType,
} from "../../model/types";
import prisma from "../../../config/client";

export const updateGoals = async (
  clerkUserId: string,
  input: UpdateGoalsRequest
): Promise<UserGoalsType> => {
  const result = await prisma.usergoals.upsert({
    update: {
      weeklyGoals: input.weeklyGoals.map((title) => ({ title })),
      monthlyGoals: input.monthlyGoals.map((title) => ({ title })),
      isEnabled: true,
    },
    create: {
      userId: clerkUserId,
      isEnabled: true,
      monthlyGoals: input.monthlyGoals.map((title) => ({ title })),
      weeklyGoals: input.weeklyGoals.map((title) => ({ title })),
      v: 0,
    },
    where: { userId: clerkUserId },
  });

  return result;
};
