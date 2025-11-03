import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";
import { TRPCError } from "@trpc/server";
import {
  ChatResponse,
  ListChatsRequest,
  ListChatsResponse,
} from "../../model/types/chat";

export async function listChats(
  userId: string,
  input: ListChatsRequest
): Promise<ListChatsResponse> {
  try {
    const { assistantId } = input;

    const assistant = await prisma.assistants.findUnique({
      where: { id: assistantId },
    });

    if (!assistant) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Assistant not found",
      });
    }
    // Fetch all folders for user (optionally filtered by assistant)
    const folders = await prisma.folders.findMany({
      where: {
        user: userId,
        assistant: assistantId,
      },
      select: {
        id: true,
        title: true,
        chats: true,
        customChatOrder: true,
      },
    });

    // Fetch all chats for user (optionally filtered by assistant)
    const chats = await prisma.chats.findMany({
      where: {
        user: userId,
        assistant: assistantId,
      },
      select: {
        id: true,
        title: true,
        folderId: true,
        createdAt: true,
        customOrder: true,
      },
    });

    // Build a map of folderId -> { id, title, chats: [], customChatOrder } preserving order
    const folderIdToFolder = new Map<
      string,
      { id: string; title: string; chats: ChatResponse[]; customChatOrder: string[] }
    >();
    for (const folder of folders) {
      folderIdToFolder.set(folder.id, {
        id: folder.id,
        title: folder.title,
        chats: [],
        customChatOrder: folder.customChatOrder || [],
      });
    }

    // Root chats (no folder)
    const rootChats: ChatResponse[] = [];

    for (const chat of chats) {
      if (chat.folderId && folderIdToFolder.has(chat.folderId)) {
        folderIdToFolder.get(chat.folderId)!.chats.push(chat);
      } else {
        rootChats.push(chat);
      }
    }

    // Sort chats: use customOrder if exists, otherwise fallback to createdAt (newest first)
    const sortChats = (chatList: ChatResponse[]) => {
      return chatList.sort((a, b) => {
        // If both have customOrder, sort by that
        if (a.customOrder !== null && a.customOrder !== undefined &&
            b.customOrder !== null && b.customOrder !== undefined) {
          return a.customOrder - b.customOrder;
        }
        // If only one has customOrder, it comes first
        if (a.customOrder !== null && a.customOrder !== undefined) return -1;
        if (b.customOrder !== null && b.customOrder !== undefined) return 1;
        // Fallback to createdAt (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    };

    // Sort chats based on folder's customChatOrder if it exists
    const sortChatsByFolderOrder = (
      chatList: ChatResponse[],
      customChatOrder: string[]
    ) => {
      if (!customChatOrder || customChatOrder.length === 0) {
        return sortChats(chatList);
      }

      // Create order map for quick lookup
      const orderMap = new Map<string, number>();
      customChatOrder.forEach((chatId, index) => {
        orderMap.set(chatId, index);
      });

      return chatList.sort((a, b) => {
        const aOrder = orderMap.get(a.id);
        const bOrder = orderMap.get(b.id);

        // If both are in customChatOrder, use that order
        if (aOrder !== undefined && bOrder !== undefined) {
          return aOrder - bOrder;
        }
        // If only one is in customChatOrder, it comes first
        if (aOrder !== undefined) return -1;
        if (bOrder !== undefined) return 1;
        // Fallback to customOrder or createdAt
        return sortChats([a, b]).indexOf(a) === 0 ? -1 : 1;
      });
    };

    // Sort root chats
    sortChats(rootChats);

    // Sort chats within each folder
    const responseFolders = Array.from(folderIdToFolder.values()).map(folder => ({
      id: folder.id,
      title: folder.title,
      chats: sortChatsByFolderOrder(folder.chats, folder.customChatOrder),
    }));

    const response: ListChatsResponse = {
      assistantName: assistant.name,
      folders: responseFolders,
      chats: rootChats,
    };

    return response;
  } catch (error) {
    logger.error("Error listing chats:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to list chats",
    });
  }
}
