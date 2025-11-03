import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "../providers/api-provider";

export const useGetResources = (assistantId?: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.rag.resources.list.queryOptions({ assistantId }));
};

export const useCreateResource = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.rag.resources.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.rag.resources.pathFilter());
      },
    })
  );
};

export const useDeleteResource = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.rag.resources.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.rag.resources.pathFilter());
      },
    })
  );
};

export const useStreamRagChat = () => {
  const trpc = useTRPC();
  return useMutation(trpc.rag.chat.stream.mutationOptions());
};
