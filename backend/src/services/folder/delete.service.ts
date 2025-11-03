import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";
import { TRPCError } from "@trpc/server";

export async function deleteFolder(userId: string, folderId: string) {
  try {
    const folder = await prisma.folders.findFirst({
      where: {
        id: folderId,
        user: userId,
      },
    });

    if (!folder) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Folder not found",
      });
    }

    // Move all chats in folder to root level
    if (folder.chats && folder.chats.length > 0) {
      await prisma.chats.updateMany({
        where: {
          id: { in: folder.chats },
        },
        data: {
          folderId: null,
        },
      });
    }

    await prisma.folders.delete({
      where: { id: folderId },
    });

    logger.info("Folder deleted", {
      folderId,
      userId,
      chatsMovedToRoot: folder.chats.length,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    logger.error("Error deleting folder:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete folder",
    });
  }
}
