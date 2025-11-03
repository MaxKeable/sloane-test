import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "../providers/api-provider";

/**
 * Query hook to list folders for an assistant
 */
export const useListFolders = (assistantId: string) => {
  const trpc = useTRPC();
  return useQuery(
    trpc.chats.folders.list.queryOptions({
      assistantId,
    })
  );
};

/**
 * Query hook to get a single folder by ID
 */
export const useGetFolder = (folderId: string, enabled: boolean = true) => {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.chats.folders.get.queryOptions({ folderId }),
    enabled: enabled && !!folderId,
  });
};

/**
 * Query hook to get all chats in a folder
 */
export const useGetChatsByFolder = (
  folderId: string,
  enabled: boolean = true
) => {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.chats.folders.getChatsByFolder.queryOptions({ folderId }),
    enabled: enabled && !!folderId,
  });
};

/**
 * Mutation hook to create a new folder
 */
export const useCreateFolder = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.chats.folders.create.mutationOptions({
      // Avoid aggressive invalidations; we'll reconcile caches optimistically
      onSettled: () => {
        try {
          queryClient.invalidateQueries(trpc.chats.folders.pathFilter());
          queryClient.invalidateQueries(trpc.chats.pathFilter());
        } catch {}
      },
    })
  );
};

/**
 * Mutation hook to update folder title
 */
export const useUpdateFolderTitle = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.chats.folders.updateTitle.mutationOptions({
      onSuccess: (_, variables) => {
        // Invalidate all folder queries
        queryClient.invalidateQueries(trpc.chats.folders.pathFilter());
        // Invalidate the specific folder
        queryClient.invalidateQueries({
          queryKey: trpc.chats.folders.get.queryKey({
            folderId: variables.folderId,
          }),
        });
      },
    })
  );
};

/**
 * Mutation hook to delete a folder
 * Moves all chats in folder to root level before deleting
 */
export const useDeleteFolder = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.chats.folders.delete.mutationOptions({
      onSuccess: () => {
        // Invalidate both folder and chat queries since chats moved to root
        queryClient.invalidateQueries(trpc.chats.folders.pathFilter());
        queryClient.invalidateQueries(trpc.chats.pathFilter());
      },
    })
  );
};

/**
 * Mutation hook to move a chat to/from a folder with optimistic updates
 * Pass undefined folderId to move to root level
 *
 * Optimistic UI: Updates the UI immediately before server confirms
 */
export const useMoveChat = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.chats.folders.moveChat.mutationOptions({
      // Optimistically update the UI before the server responds
      onMutate: async ({ chatId, folderId }) => {
        // Cancel any outgoing refetches to prevent race conditions
        await queryClient.cancelQueries(trpc.chats.pathFilter());
        await queryClient.cancelQueries(trpc.chats.folders.pathFilter());

        // Snapshot the previous state for rollback
        const previousChatsData = queryClient.getQueriesData(
          trpc.chats.pathFilter()
        );
        const previousFoldersData = queryClient.getQueriesData(
          trpc.chats.folders.pathFilter()
        );

        // Optimistically update all chat list queries (there may be multiple for different assistants)
        queryClient.setQueriesData(
          { queryKey: trpc.chats.list.queryKey() },
          (old: any) => {
            if (!old) return old;

            // Data structure is { assistantName, folders: [], chats: [] }
            const { folders, chats } = old;

            // Find the chat and its current location
            let chatToMove = null;
            let sourceFolderId: string | undefined = undefined;

            // First check root chats
            chatToMove = chats?.find((c: any) => c.id === chatId);

            // If not in root, search in folders
            if (!chatToMove) {
              for (const folder of folders || []) {
                const foundChat = folder.chats?.find((c: any) => c.id === chatId);
                if (foundChat) {
                  chatToMove = foundChat;
                  sourceFolderId = folder.id;
                  break;
                }
              }
            }

            // If chat not found, return unchanged
            if (!chatToMove) return old;

            // Update the chat's folderId
            const updatedChat = { ...chatToMove, folderId };

            // Remove from source
            let updatedFolders = folders || [];
            let updatedChats = chats || [];

            if (sourceFolderId) {
              // Remove from source folder
              updatedFolders = updatedFolders.map((folder: any) =>
                folder.id === sourceFolderId
                  ? { ...folder, chats: folder.chats?.filter((c: any) => c.id !== chatId) || [] }
                  : folder
              );
            } else {
              // Remove from root chats
              updatedChats = updatedChats.filter((c: any) => c.id !== chatId);
            }

            // Add to destination
            if (folderId) {
              // Add to target folder
              updatedFolders = updatedFolders.map((folder: any) =>
                folder.id === folderId
                  ? { ...folder, chats: [...(folder.chats || []), updatedChat] }
                  : folder
              );
            } else {
              // Add to root chats
              updatedChats = [...updatedChats, updatedChat];
            }

            return {
              ...old,
              folders: updatedFolders,
              chats: updatedChats,
            };
          }
        );

        // Return snapshot for rollback
        return { previousChatsData, previousFoldersData };
      },

      // Rollback on error
      onError: (err, variables, context) => {
        // Restore previous state
        if (context?.previousChatsData) {
          context.previousChatsData.forEach(([queryKey, data]) => {
            queryClient.setQueryData(queryKey, data);
          });
        }
        if (context?.previousFoldersData) {
          context.previousFoldersData.forEach(([queryKey, data]) => {
            queryClient.setQueryData(queryKey, data);
          });
        }

        console.error("Failed to move chat:", err);
      },

      // Always refetch after error or success to sync with server
      onSettled: () => {
        queryClient.invalidateQueries(trpc.chats.pathFilter());
        queryClient.invalidateQueries(trpc.chats.folders.pathFilter());
      },
    })
  );
};

/**
 * Mutation hook to reorder a chat within its context (folder or root) with optimistic updates
 *
 * Optimistic UI: Immediately reorders chats in the UI before server confirms
 */
export const useReorderChat = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.chats.folders.reorderChat.mutationOptions({
      // Optimistically update the UI before the server responds
      onMutate: async ({ chatId, newIndex, folderId, assistantId }) => {
        // Cancel any outgoing refetches to prevent race conditions
        await queryClient.cancelQueries(trpc.chats.pathFilter());
        await queryClient.cancelQueries(trpc.chats.folders.pathFilter());

        // Snapshot the previous state for rollback
        const previousChatsData = queryClient.getQueriesData(
          trpc.chats.pathFilter()
        );

        // Optimistically update the chat list query
        queryClient.setQueryData(
          trpc.chats.list.queryKey({ assistantId }),
          (old: any) => {
            if (!old) return old;

            // If reordering within a folder
            if (folderId) {
              const updatedFolders = old.folders.map((folder: any) => {
                if (folder.id === folderId) {
                  // Find and remove the chat
                  const chats = [...folder.chats];
                  const currentIndex = chats.findIndex((c: any) => c.id === chatId);
                  if (currentIndex === -1) return folder;

                  // Reorder
                  const [movedChat] = chats.splice(currentIndex, 1);
                  chats.splice(newIndex, 0, movedChat);

                  return { ...folder, chats };
                }
                return folder;
              });

              return { ...old, folders: updatedFolders };
            } else {
              // Reordering within root chats
              const chats = [...old.chats];
              const currentIndex = chats.findIndex((c: any) => c.id === chatId);
              if (currentIndex === -1) return old;

              // Reorder
              const [movedChat] = chats.splice(currentIndex, 1);
              chats.splice(newIndex, 0, movedChat);

              return { ...old, chats };
            }
          }
        );

        // Return snapshot for rollback
        return { previousChatsData };
      },

      // Rollback on error
      onError: (err, variables, context) => {
        // Restore previous state
        if (context?.previousChatsData) {
          context.previousChatsData.forEach(([queryKey, data]) => {
            queryClient.setQueryData(queryKey, data);
          });
        }

        console.error("Failed to reorder chat:", err);
      },

      // Always refetch after error or success to sync with server
      onSettled: () => {
        queryClient.invalidateQueries(trpc.chats.pathFilter());
        queryClient.invalidateQueries(trpc.chats.folders.pathFilter());
      },
    })
  );
};
