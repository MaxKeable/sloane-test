import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";
import { TRPCError } from "@trpc/server";

export async function getChatsByFolder(userId: string, folderId: string) {
  try {
    const chats = await prisma.chats.findMany({
      where: {
        folderId: folderId,
        user: userId,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return chats;
  } catch (error) {
    logger.error("Error getting chats by folder:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get chats by folder",
    });
  }
}
