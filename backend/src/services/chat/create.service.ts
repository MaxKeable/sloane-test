import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";
import { TRPCError } from "@trpc/server";

interface CreateChatInput {
  assistantId: string;
  folderId?: string;
  title?: string;
}

export async function createChat(userId: string, input: CreateChatInput) {
  try {
    // Handle empty string as null
    const assistantFilter = input.assistantId && input.assistantId.trim() !== ""
      ? input.assistantId
      : null;

    const chat = await prisma.chats.create({
      data: {
        user: userId,
        assistant: assistantFilter,
        folderId: input.folderId || null,
        title: input.title || "** New Chat **",
        messages: [],
        v: 0,
      },
    });

    // If in folder, add to folder.chats array
    if (input.folderId) {
      const folder = await prisma.folders.findFirst({
        where: {
          id: input.folderId,
          user: userId,
        },
      });

      if (folder) {
        await prisma.folders.update({
          where: { id: input.folderId },
          data: {
            chats: [...folder.chats, chat.id],
          },
        });
      }
    }

    logger.info("Chat created", {
      chatId: chat.id,
      userId,
      assistantId: assistantFilter,
    });

    return chat;
  } catch (error) {
    logger.error("Error creating chat:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create chat",
    });
  }
}
