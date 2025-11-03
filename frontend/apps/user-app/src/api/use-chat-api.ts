import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "../providers/api-provider";

export const useListChats = (assistantId: string) => {
  const trpc = useTRPC();
  return useQuery(
    trpc.chats.list.queryOptions({
      assistantId,
    })
  );
};

/**
 * Query hook to get a single chat by ID
 */
export const useGetChat = (chatId: string, enabled: boolean = true) => {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.chats.get.queryOptions({ chatId }),
    enabled: enabled && !!chatId,
  });
};

/**
 * Mutation hook to create a new chat
 * Invalidates chat and folder queries on success
 */
export const useCreateChat = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.chats.create.mutationOptions({
      // Avoid aggressive invalidations that cause list flicker; we'll reconcile caches manually
      onSettled: (_data, _error, variables) => {
        // Do a gentle background refetch to ensure server truth without disrupting optimistic UI
        try {
          // Invalidate chats.list queries; keep it broad via pathFilter for safety
          queryClient.invalidateQueries(trpc.chats.pathFilter());
        } catch {}
      },
    })
  );
};

/**
 * Mutation hook to send a message in a chat
 * Note: Actual response comes via Socket.IO
 * This just triggers the backend to start streaming
 */
export const useSendMessage = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.chats.sendMessage.mutationOptions({
      onSuccess: (_, variables) => {
        // Invalidate the specific chat to refetch with new message
        queryClient.invalidateQueries({
          queryKey: trpc.chats.get.queryKey({ chatId: variables.chatId }),
        });
      },
    })
  );
};

/**
 * Mutation hook to update chat title
 */
export const useUpdateChatTitle = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.chats.updateTitle.mutationOptions({
      // Optimistic update: update caches immediately to avoid UI delay after modal close
      onMutate: async (variables) => {
        const { chatId, title } = variables;

        // Cancel outgoing refetches
        await queryClient.cancelQueries(trpc.chats.pathFilter());

        // Snapshot previous list caches for rollback
        const previousLists = queryClient.getQueriesData(
          trpc.chats.list.pathFilter?.() ?? {
            queryKey: trpc.chats.list.queryKey(),
          }
        );
        const previousGet = queryClient.getQueryData(
          trpc.chats.get.queryKey({ chatId })
        );

        // Update all chats.list caches (any assistant)
        queryClient.setQueriesData(
          { queryKey: trpc.chats.list.queryKey() },
          (old: any) => {
            if (!old) return old;
            const updateTitleInArray = (arr: any[]) =>
              (arr || []).map((c: any) =>
                c.id === chatId ? { ...c, title } : c
              );
            return {
              ...old,
              chats: updateTitleInArray(old.chats),
              folders: (old.folders || []).map((f: any) => ({
                ...f,
                chats: updateTitleInArray(f.chats),
              })),
            };
          }
        );

        // Update the specific chat cache
        queryClient.setQueryData(
          trpc.chats.get.queryKey({ chatId }),
          (old: any) => (old ? { ...old, title } : old)
        );

        return { previousLists, previousGet };
      },
      onError: (_err, variables, context) => {
        // Rollback on error
        if (context?.previousLists) {
          context.previousLists.forEach(([key, data]: any) => {
            queryClient.setQueryData(key, data);
          });
        }
        if (context?.previousGet) {
          queryClient.setQueryData(
            trpc.chats.get.queryKey({ chatId: variables.chatId }),
            context.previousGet
          );
        }
      },
      onSettled: (_data, _error, variables) => {
        // Gentle refetch to sync with server
        queryClient.invalidateQueries(trpc.chats.pathFilter());
        queryClient.invalidateQueries({
          queryKey: trpc.chats.get.queryKey({ chatId: variables.chatId }),
        });
      },
    })
  );
};

/**
 * Mutation hook to delete a chat
 */
export const useDeleteChat = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.chats.delete.mutationOptions({
      // Optimistic removal: update caches immediately
      onMutate: async ({ chatId }) => {
        await queryClient.cancelQueries(trpc.chats.pathFilter());

        const previousLists = queryClient.getQueriesData(
          trpc.chats.list.pathFilter?.() ?? {
            queryKey: trpc.chats.list.queryKey(),
          }
        );
        const previousGet = queryClient.getQueryData(
          trpc.chats.get.queryKey({ chatId })
        );

        queryClient.setQueriesData(
          { queryKey: trpc.chats.list.queryKey() },
          (old: any) => {
            if (!old) return old;
            const removeFromArray = (arr: any[]) =>
              (arr || []).filter((c: any) => c.id !== chatId);
            return {
              ...old,
              chats: removeFromArray(old.chats),
              folders: (old.folders || []).map((f: any) => ({
                ...f,
                chats: removeFromArray(f.chats),
              })),
            };
          }
        );

        // Remove individual chat cache
        queryClient.removeQueries({
          queryKey: trpc.chats.get.queryKey({ chatId }),
        });

        return { previousLists, previousGet };
      },
      onError: (_err, variables, context) => {
        if (context?.previousLists) {
          context.previousLists.forEach(([key, data]: any) => {
            queryClient.setQueryData(key, data);
          });
        }
        if (context?.previousGet) {
          queryClient.setQueryData(
            trpc.chats.get.queryKey({ chatId: variables.chatId }),
            context.previousGet
          );
        }
      },
      onSettled: () => {
        // Background refetch to confirm
        queryClient.invalidateQueries(trpc.chats.pathFilter());
        queryClient.invalidateQueries(trpc.chats.folders.pathFilter());
      },
    })
  );
};

export const useChatAssistantList = () => {
  const trpc = useTRPC();
  return useQuery(trpc.chats.assistants.list.queryOptions());
};
