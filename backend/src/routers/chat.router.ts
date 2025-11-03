import { router, procedure } from "./trpc";
import {
  createChatRequestSchema,
  listChatsRequestSchema,
  getChatRequestSchema,
  updateChatTitleRequestSchema,
  deleteChatRequestSchema,
  sendMessageRequestSchema,
  createFolderRequestSchema,
  listFoldersRequestSchema,
  getFolderRequestSchema,
  updateFolderTitleRequestSchema,
  deleteFolderRequestSchema,
  moveChatRequestSchema,
  reorderChatRequestSchema,
  getChatsByFolderRequestSchema,
  getChatsByUserRequestSchema,
} from "../model/types/chat";
import { createChat } from "../services/chat/create.service";
import { listChats } from "../services/chat/list.service";
import { getChat } from "../services/chat/get.service";
import { updateChatTitle } from "../services/chat/update-title.service";
import { deleteChat } from "../services/chat/delete.service";
import { sendMessage } from "../services/chat/send-message.service";
import { getChatsByUser } from "../services/chat/get-by-user.service";
import { createFolder } from "../services/folder/create.service";
import { listFolders } from "../services/folder/list.service";
import { getFolder } from "../services/folder/get.service";
import { getChatsByFolder } from "../services/folder/get-chats.service";
import { updateFolderTitle } from "../services/folder/update-title.service";
import { deleteFolder } from "../services/folder/delete.service";
import { moveChat } from "../services/folder/move-chat.service";
import { reorderChat } from "../services/folder/reorder-chat.service";
import { listAssistants } from "../services/assistant/list.service";

export const chatRouter = router({
  // Chat routes
  create: procedure
    .input(createChatRequestSchema)
    .mutation(async ({ input, ctx }) => {
      return await createChat(ctx.clerkUserId ?? "", input);
    }),

  list: procedure
    .input(listChatsRequestSchema)
    .query(async ({ input, ctx }) => {
      return await listChats(ctx.clerkUserId ?? "", input);
    }),

  get: procedure.input(getChatRequestSchema).query(async ({ input, ctx }) => {
    return await getChat(ctx.clerkUserId ?? "", input.chatId);
  }),

  updateTitle: procedure
    .input(updateChatTitleRequestSchema)
    .mutation(async ({ input, ctx }) => {
      return await updateChatTitle(
        ctx.clerkUserId ?? "",
        input.chatId,
        input.title
      );
    }),

  delete: procedure
    .input(deleteChatRequestSchema)
    .mutation(async ({ input, ctx }) => {
      return await deleteChat(ctx.clerkUserId ?? "", input.chatId);
    }),

  sendMessage: procedure
    .input(sendMessageRequestSchema)
    .mutation(async ({ input, ctx }) => {
      return await sendMessage(ctx.clerkUserId ?? "", input);
    }),

  // Admin route to get all chats for a user
  getChatsByUser: procedure
    .input(getChatsByUserRequestSchema)
    .query(async ({ input }) => {
      return await getChatsByUser(input);
    }),

  // Folder routes
  folders: router({
    create: procedure
      .input(createFolderRequestSchema)
      .mutation(async ({ input, ctx }) => {
        return await createFolder(ctx.clerkUserId ?? "", input);
      }),

    list: procedure
      .input(listFoldersRequestSchema)
      .query(async ({ input, ctx }) => {
        return await listFolders(ctx.clerkUserId ?? "", input);
      }),

    get: procedure
      .input(getFolderRequestSchema)
      .query(async ({ input, ctx }) => {
        return await getFolder(ctx.clerkUserId ?? "", input.folderId);
      }),

    getChatsByFolder: procedure
      .input(getChatsByFolderRequestSchema)
      .query(async ({ input, ctx }) => {
        return await getChatsByFolder(ctx.clerkUserId ?? "", input.folderId);
      }),

    updateTitle: procedure
      .input(updateFolderTitleRequestSchema)
      .mutation(async ({ input, ctx }) => {
        return await updateFolderTitle(
          ctx.clerkUserId ?? "",
          input.folderId,
          input.title
        );
      }),

    delete: procedure
      .input(deleteFolderRequestSchema)
      .mutation(async ({ input, ctx }) => {
        return await deleteFolder(ctx.clerkUserId ?? "", input.folderId);
      }),

    moveChat: procedure
      .input(moveChatRequestSchema)
      .mutation(async ({ input, ctx }) => {
        return await moveChat(ctx.clerkUserId ?? "", input);
      }),

    reorderChat: procedure
      .input(reorderChatRequestSchema)
      .mutation(async ({ input, ctx }) => {
        return await reorderChat(ctx.clerkUserId ?? "", input);
      }),
  }),

  assistants: router({
    list: procedure.query(async () => {
      return await listAssistants();
    }),
  }),
});
