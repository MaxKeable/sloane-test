import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";
import { TRPCError } from "@trpc/server";

export async function getChat(userId: string, chatId: string) {
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

    return chat;
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    logger.error("Error getting chat:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get chat",
    });
  }
}
