import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";
import { TRPCError } from "@trpc/server";

interface ListFoldersInput {
  assistantId: string;
}

export async function listFolders(userId: string, input: ListFoldersInput) {
  try {
    // Handle empty string as null for playground
    const assistantFilter = input.assistantId && input.assistantId.trim() !== ""
      ? input.assistantId
      : null;

    const folders = await prisma.folders.findMany({
      where: {
        user: userId,
        assistant: assistantFilter,
      },
      select: {
        id: true,
        title: true,
        chats: true,
      },
    });

    return folders;
  } catch (error) {
    logger.error("Error listing folders:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to list folders",
    });
  }
}
