import prisma from "../../../config/client";
import { UserGoals } from "../../model/types";

export const clearGoals = async (
  clerkUserId: string,
  type: "weekly" | "monthly"
): Promise<UserGoals> => {
  const update = type === "weekly" ? { weeklyGoals: [] } : { monthlyGoals: [] };

  const result = await prisma.usergoals.update({
    where: { userId: clerkUserId },
    data: update,
  });

  if (!result) {
    throw new Error("Goals not found");
  }

  return result;
};
