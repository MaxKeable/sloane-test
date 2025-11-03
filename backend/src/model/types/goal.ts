import { usergoals, UsergoalsWeeklyGoals } from "@prisma/client";
import { z } from "zod";

export type UserGoals = usergoals;

export type Goal = UsergoalsWeeklyGoals;

export const GoalType = z.enum(["weekly", "monthly"]);
export type GoalType = z.infer<typeof GoalType>;

export const updateGoalsRequestSchema = z.object({
  weeklyGoals: z.array(z.string()),
  monthlyGoals: z.array(z.string()),
});

export type UpdateGoalsRequest = z.infer<typeof updateGoalsRequestSchema>;

export const toggleGoalRequestSchema = z.object({
  goalId: z.string(),
  type: GoalType,
});

export type ToggleGoalRequest = z.infer<typeof toggleGoalRequestSchema>;

export const clearGoalsRequestSchema = z.object({
  type: GoalType,
});
export type ClearGoalsRequest = z.infer<typeof clearGoalsRequestSchema>;
