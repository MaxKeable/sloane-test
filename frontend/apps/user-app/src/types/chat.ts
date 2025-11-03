/**
 * Chat and Folder types inferred from backend tRPC router
 * Provides full type safety from backend to frontend
 */

// Import the router type from backend
// Note: Adjust path based on your monorepo structure
import type { AppApiRouter } from "../../../../../backend/src/routers/app-api.router";
import type { inferRouterOutputs, inferRouterInputs } from "@trpc/server";

// Infer all router outputs (return types)
type RouterOutputs = inferRouterOutputs<AppApiRouter>;

// Infer all router inputs (parameter types)
type RouterInputs = inferRouterInputs<AppApiRouter>;

// ===== Chat Types =====

export type Chat = RouterOutputs["chats"]["get"];
export type ChatListItem = RouterOutputs["chats"]["list"][number];
export type ChatList = RouterOutputs["chats"]["list"];

export type CreateChatInput = RouterInputs["chats"]["create"];
export type SendMessageInput = RouterInputs["chats"]["sendMessage"];
export type UpdateChatTitleInput = RouterInputs["chats"]["updateTitle"];

// ===== Folder Types =====

export type Folder = RouterOutputs["chats"]["folders"]["get"];
export type FolderListItem = RouterOutputs["chats"]["folders"]["list"][number];
export type FolderList = RouterOutputs["chats"]["folders"]["list"];

export type CreateFolderInput = RouterInputs["chats"]["folders"]["create"];
export type UpdateFolderTitleInput =
  RouterInputs["chats"]["folders"]["updateTitle"];
export type MoveChatInput = RouterInputs["chats"]["folders"]["moveChat"];

// ===== Message Types =====

// Extract message type from chat
export type ChatMessage = Chat["messages"][number];

// ===== Chat Type Enum =====

export type ChatType = "expert" | "playground";

// ===== Helper Types =====

export interface ChatContextState {
  selectedChat: Chat | undefined;
  setSelectedChat: (chat: Chat | undefined) => void;
  selectChat: (chatId: string) => Promise<void>;
  allChats: ChatList;
  isChatsLoading: boolean;
  createChat: (folderId?: string) => Promise<Chat>;
  deleteChat: (chatId: string) => Promise<void>;
  updateChatTitle: (chatId: string, newTitle: string) => Promise<void>;
  moveChat: (chatId: string, folderId?: string) => Promise<void>;
  sendMessage: (
    prompt: string,
    room: string,
    file?: File | null,
    chatId?: string
  ) => Promise<void>;
  isMessageLoading: boolean;
}

export interface FolderContextState {
  selectedFolder: Folder | undefined;
  setSelectedFolder: (folder: Folder | undefined) => void;
  allFolders: FolderList;
  isFoldersLoading: boolean;
  folderChats: ChatList;
  isFolderChatsLoading: boolean;
  createFolder: (title: string) => Promise<Folder>;
  deleteFolder: (folderId: string) => Promise<void>;
  updateFolderTitle: (folderId: string, newTitle: string) => Promise<void>;
  selectFolder: (folderId: string) => Promise<void>;
}
