import { ToggleGoalRequest, UserGoals, Goal } from "../../model/types";
import prisma from "../../../config/client";

export const toggleGoal = async (
  clerkUserId: string,
  input: ToggleGoalRequest
): Promise<UserGoals> => {
  const currentUserGoals = await prisma.usergoals.findUnique({
    where: { userId: clerkUserId },
    include: {
      monthlyGoals: true,
      weeklyGoals: true,
    },
  });

  if (!currentUserGoals) {
    throw new Error("Goals not found");
  }

  if (input.type === "weekly") {
    const exists = currentUserGoals.weeklyGoals.some(
      (g: Goal) => g.title === input.goalId
    );
    if (!exists) throw new Error("Weekly goal not found");

    const updatedWeekly = currentUserGoals.weeklyGoals.map((g: Goal) =>
      g.title === input.goalId ? { ...g, isCompleted: !g.isCompleted } : g
    );

    const setWeekly = updatedWeekly.map((g: Goal) => ({
      title: g.title,
      isCompleted: g.isCompleted,
      createdAt: g.createdAt,
      completedAt: g.completedAt ?? undefined,
    }));

    const updated = await prisma.usergoals.update({
      where: { userId: clerkUserId },
      data: { weeklyGoals: { set: setWeekly } },
      include: { weeklyGoals: true, monthlyGoals: true },
    });

    return updated;
  }

  const exists = currentUserGoals.monthlyGoals.some(
    (g: Goal) => g.title === input.goalId
  );
  if (!exists) throw new Error("Monthly goal not found");

  const updatedMonthly = currentUserGoals.monthlyGoals.map((g: Goal) =>
    g.title === input.goalId ? { ...g, isCompleted: !g.isCompleted } : g
  );

  const setMonthly = updatedMonthly.map((g: Goal) => ({
    title: g.title,
    isCompleted: g.isCompleted,
    createdAt: g.createdAt,
    completedAt: g.completedAt ?? undefined,
  }));

  const updated = await prisma.usergoals.update({
    where: { userId: clerkUserId },
    data: { monthlyGoals: { set: setMonthly } },
    include: { weeklyGoals: true, monthlyGoals: true },
  });

  return updated;
};
