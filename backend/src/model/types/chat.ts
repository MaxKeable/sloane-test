import { z } from "zod";
import { chatsSchema } from "../db/generated/schemas/models/chats.schema";
import { FolderResponse } from "./folder";

// Create Chat Request
export const createChatRequestSchema = z.object({
  assistantId: z.string(),
  folderId: z.string().optional(),
  title: z.string().optional(),
});
export type CreateChatRequest = z.infer<typeof createChatRequestSchema>;

export const chatResponseSchema = chatsSchema.pick({
  id: true,
  title: true,
  createdAt: true,
  folderId: true,
  customOrder: true,
});
export type ChatResponse = z.infer<typeof chatResponseSchema>;

export const listChatsRequestSchema = z
  .object({
    assistantId: z.string(),
  })
  .required({
    assistantId: true,
  });
export type ListChatsRequest = z.infer<typeof listChatsRequestSchema>;

export interface ListChatsResponse {
  assistantName: string;
  folders: FolderResponse[];
  chats: ChatResponse[];
}

// Get Chat Request
export const getChatRequestSchema = z.object({
  chatId: z.string(),
});
export type GetChatRequest = z.infer<typeof getChatRequestSchema>;

// Update Chat Title Request
export const updateChatTitleRequestSchema = z.object({
  chatId: z.string(),
  title: z.string().min(1),
});
export type UpdateChatTitleRequest = z.infer<
  typeof updateChatTitleRequestSchema
>;

// Delete Chat Request
export const deleteChatRequestSchema = z.object({
  chatId: z.string(),
});
export type DeleteChatRequest = z.infer<typeof deleteChatRequestSchema>;

// File Upload Schema (for sendMessage)
export const fileUploadSchema = z.object({
  data: z.string(), // base64 encoded
  mimeType: z.string(),
  filename: z.string(),
});
export type FileUpload = z.infer<typeof fileUploadSchema>;

// Send Message Request
export const sendMessageRequestSchema = z.object({
  chatId: z.string(),
  message: z.string().min(1),
  file: fileUploadSchema.optional(),
  enableTools: z.boolean().optional(),
  enableWebSearch: z.boolean().optional(),
  selectedModel: z.string().optional(),
});
export type SendMessageRequest = z.infer<typeof sendMessageRequestSchema>;

// Folder Schemas
export const createFolderRequestSchema = z.object({
  title: z.string().min(1),
  assistantId: z.string(),
});
export type CreateFolderRequest = z.infer<typeof createFolderRequestSchema>;

export const listFoldersRequestSchema = z.object({
  assistantId: z.string(),
});
export type ListFoldersRequest = z.infer<typeof listFoldersRequestSchema>;

export const getFolderRequestSchema = z.object({
  folderId: z.string(),
});
export type GetFolderRequest = z.infer<typeof getFolderRequestSchema>;

export const updateFolderTitleRequestSchema = z.object({
  folderId: z.string(),
  title: z.string().min(1),
});
export type UpdateFolderTitleRequest = z.infer<
  typeof updateFolderTitleRequestSchema
>;

export const deleteFolderRequestSchema = z.object({
  folderId: z.string(),
});
export type DeleteFolderRequest = z.infer<typeof deleteFolderRequestSchema>;

export const moveChatRequestSchema = z.object({
  chatId: z.string(),
  folderId: z.string().optional(), // null = move to root
});
export type MoveChatRequest = z.infer<typeof moveChatRequestSchema>;

export const reorderChatRequestSchema = z.object({
  chatId: z.string(),
  newIndex: z.number().int().min(0),
  folderId: z.string().optional(), // undefined = root level
  assistantId: z.string(),
});
export type ReorderChatRequest = z.infer<typeof reorderChatRequestSchema>;

// Get Chats by Folder
export const getChatsByFolderRequestSchema = z.object({
  folderId: z.string(),
});
export type GetChatsByFolderRequest = z.infer<
  typeof getChatsByFolderRequestSchema
>;

// Get Chats by User (Admin only)
export const getChatsByUserRequestSchema = z.object({
  userId: z.string(), // MongoDB User ID
});
export type GetChatsByUserRequest = z.infer<typeof getChatsByUserRequestSchema>;
