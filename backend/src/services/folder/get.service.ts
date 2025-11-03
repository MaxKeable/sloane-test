import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";
import { TRPCError } from "@trpc/server";

export async function getFolder(userId: string, folderId: string) {
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

    return folder;
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    logger.error("Error getting folder:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get folder",
    });
  }
}
