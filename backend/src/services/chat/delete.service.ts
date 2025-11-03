import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";
import { TRPCError } from "@trpc/server";

export async function deleteChat(userId: string, chatId: string) {
  try {
    const chat = await prisma.chats.findFirst({
      where: {
        id: chatId,
        user: userId,
      },
    });

    if (!chat) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Chat not found",
      });
    }

    // Remove from folder if exists
    if (chat.folderId) {
      const folder = await prisma.folders.findUnique({
        where: { id: chat.folderId },
      });

      if (folder) {
        await prisma.folders.update({
          where: { id: chat.folderId },
          data: {
            chats: folder.chats.filter((id) => id !== chat.id),
          },
        });
      }
    }

    await prisma.chats.delete({
      where: { id: chatId },
    });

    logger.info("Chat deleted", {
      chatId,
      userId,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    logger.error("Error deleting chat:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete chat",
    });
  }
}
