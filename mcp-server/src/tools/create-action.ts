import { trpcClient } from "../utils/trpc-client.js";
import { z } from "zod";

const createActionInputSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
});

interface CreateActionResult {
  message: string;
  title: string | null;
  [key: string]: unknown;
}

export const createActionTool = async (
  title: string
): Promise<CreateActionResult> => {
  try {
    console.log(
      "[createActionTool] Attempting to create action with title:",
      title
    );

    const validatedInput = createActionInputSchema.parse({ title });

    const result = await trpcClient.createAction.mutate(validatedInput);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[createActionTool] Failed to create action:", errorMessage);
    throw new Error(`Failed to create action: ${errorMessage}`);
  }
};
