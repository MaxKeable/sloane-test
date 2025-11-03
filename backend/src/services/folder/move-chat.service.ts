import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";
import { TRPCError } from "@trpc/server";

interface MoveChatInput {
  chatId: string;
  folderId?: string;
}

export async function moveChat(userId: string, input: MoveChatInput) {
  try {
    // Get chat
    const chat = await prisma.chats.findFirst({
      where: {
        id: input.chatId,
        user: userId,
      },
    });

    if (!chat) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Chat not found",
      });
    }

    const oldFolderId = chat.folderId;
    const newFolderId = input.folderId || null;

    // Remove from old folder
    if (oldFolderId) {
      const oldFolder = await prisma.folders.findUnique({
        where: { id: oldFolderId },
      });

      if (oldFolder) {
        await prisma.folders.update({
          where: { id: oldFolderId },
          data: {
            chats: oldFolder.chats.filter((id) => id !== input.chatId),
          },
        });
      }
    }

    // Add to new folder
    if (newFolderId) {
      const newFolder = await prisma.folders.findFirst({
        where: {
          id: newFolderId,
          user: userId,
        },
      });

      if (!newFolder) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Target folder not found",
        });
      }

      await prisma.folders.update({
        where: { id: newFolderId },
        data: {
          chats: [...newFolder.chats, input.chatId],
        },
      });
    }

    // Update chat
    await prisma.chats.update({
      where: { id: input.chatId },
      data: { folderId: newFolderId },
    });

    logger.info("Chat moved", {
      chatId: input.chatId,
      userId,
      from: oldFolderId || "root",
      to: newFolderId || "root",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    logger.error("Error moving chat:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to move chat",
    });
  }
}
