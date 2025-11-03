import { assistantsSchema } from "../db/generated/schemas/models";
import { z } from "zod";

export const assistantResponseSchema = assistantsSchema.pick({
  id: true,
  name: true,
  description: true,
  allowModelSelection: true,
});
export type AssistantResponse = z.infer<typeof assistantResponseSchema>;

export const assistantListResponseSchema = z.object({
  freeStyle: assistantResponseSchema.nullable(),
  assistants: z.array(assistantResponseSchema),
});
export type AssistantListResponse = z.infer<typeof assistantListResponseSchema>;
