import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";
import { TRPCError } from "@trpc/server";

interface CreateFolderInput {
  title: string;
  assistantId: string;
}

export async function createFolder(userId: string, input: CreateFolderInput) {
  try {
    // Handle empty string as null for playground
    const assistantFilter = input.assistantId && input.assistantId.trim() !== ""
      ? input.assistantId
      : null;

    const folder = await prisma.folders.create({
      data: {
        user: userId,
        assistant: assistantFilter,
        title: input.title,
        chats: [],
        v: 0,
      },
    });

    logger.info("Folder created", {
      folderId: folder.id,
      userId,
      assistantId: input.assistantId,
    });

    return folder;
  } catch (error) {
    logger.error("Error creating folder:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create folder",
    });
  }
}
