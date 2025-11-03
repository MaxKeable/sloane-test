import { z } from "zod";
import prisma from "../../../../config/client";

export const createActionRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export type CreateActionRequest = z.infer<typeof createActionRequestSchema>;

export const createActionService = async (
  input: CreateActionRequest
): Promise<{ message: string; title: string | null }> => {
  const { title } = input;

  const action = await prisma.actions.create({
    data: {
      title,
      text: title,
      column: "idea",
      userId: "user_31tiLXd9ywrcRGgxiBfKNDjl0we",
      v: 0,
    },
  });

  return {
    message: "Action created successfully",
    title: action.title,
  };
};
