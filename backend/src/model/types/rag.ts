import { z } from "zod";

export const createResourceRequestSchema = z.object({
  content: z.string().min(10),
  assistantId: z.string().optional(),
  metadata: z
    .object({
      title: z.string().optional(),
      source: z.string().optional(),
      type: z.string().optional(),
    })
    .optional(),
});

export type CreateResourceRequest = z.infer<typeof createResourceRequestSchema>;

export const listResourcesRequestSchema = z
  .object({
    assistantId: z.string().optional(),
  })
  .optional();

export type ListResourcesRequest = z.infer<typeof listResourcesRequestSchema>;

export const deleteResourceRequestSchema = z.object({
  resourceId: z.string(),
});

export type DeleteResourceRequest = z.infer<typeof deleteResourceRequestSchema>;

export const ragChatStreamRequestSchema = z.object({
  chatId: z.string(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
    })
  ),
  assistantId: z.string().optional(),
  systemPrompt: z.string().optional(),
});

export type RagChatStreamRequest = z.infer<typeof ragChatStreamRequestSchema>;
