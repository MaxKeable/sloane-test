import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";
import { TRPCError } from "@trpc/server";

interface ReorderChatInput {
  chatId: string;
  newIndex: number;
  folderId?: string; // undefined = root level chats
  assistantId: string;
}

export async function reorderChat(userId: string, input: ReorderChatInput) {
  try {
    const { chatId, newIndex, folderId, assistantId } = input;

    // Verify chat exists and belongs to user
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

    // Get all chats in the same context (folder or root)
    const chats = await prisma.chats.findMany({
      where: {
        user: userId,
        assistant: assistantId,
        folderId: folderId || null,
      },
      select: {
        id: true,
        customOrder: true,
        createdAt: true,
      },
    });

    // Sort chats by current order (customOrder or createdAt)
    const sortedChats = chats.sort((a, b) => {
      if (a.customOrder !== null && a.customOrder !== undefined &&
          b.customOrder !== null && b.customOrder !== undefined) {
        return a.customOrder - b.customOrder;
      }
      if (a.customOrder !== null && a.customOrder !== undefined) return -1;
      if (b.customOrder !== null && b.customOrder !== undefined) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Remove the chat from its current position
    const currentIndex = sortedChats.findIndex((c) => c.id === chatId);
    if (currentIndex === -1) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Chat not found in context",
      });
    }

    // If moving to same position, no-op
    if (currentIndex === newIndex) {
      return { success: true };
    }

    const [movedChat] = sortedChats.splice(currentIndex, 1);
    sortedChats.splice(newIndex, 0, movedChat);

    // Assign new customOrder values (0, 1, 2, ...)
    const updates = sortedChats.map((c, index) => ({
      id: c.id,
      customOrder: index,
    }));

    // Batch update all chats with new customOrder
    await Promise.all(
      updates.map((update) =>
        prisma.chats.update({
          where: { id: update.id },
          data: { customOrder: update.customOrder },
        })
      )
    );

    // If within a folder, update the folder's customChatOrder
    if (folderId) {
      const folder = await prisma.folders.findFirst({
        where: {
          id: folderId,
          user: userId,
        },
      });

      if (folder) {
        const orderedChatIds = sortedChats.map((c) => c.id);
        await prisma.folders.update({
          where: { id: folderId },
          data: { customChatOrder: orderedChatIds },
        });
      }
    }

    logger.info("Chats reordered", {
      chatId,
      userId,
      folderId: folderId || "root",
      newIndex,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    logger.error("Error reordering chat:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to reorder chat",
    });
  }
}
