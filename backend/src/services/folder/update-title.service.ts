import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";
import { TRPCError } from "@trpc/server";

export async function updateFolderTitle(
  userId: string,
  folderId: string,
  title: string
) {
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

    const updatedFolder = await prisma.folders.update({
      where: { id: folderId },
      data: { title },
    });

    logger.info("Folder title updated", {
      folderId,
      userId,
    });

    return updatedFolder;
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    logger.error("Error updating folder title:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update folder title",
    });
  }
}
