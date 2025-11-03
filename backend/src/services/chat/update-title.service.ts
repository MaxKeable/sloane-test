import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";
import { TRPCError } from "@trpc/server";

export async function updateChatTitle(
  userId: string,
  chatId: string,
  title: string
) {
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

    const updatedChat = await prisma.chats.update({
      where: { id: chatId },
      data: { title },
    });

    logger.info("Chat title updated", {
      chatId,
      userId,
    });

    return updatedChat;
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    logger.error("Error updating chat title:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update chat title",
    });
  }
}
