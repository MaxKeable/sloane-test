import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "../providers/api-provider";

export const useGetGoals = () => {
  const trpc = useTRPC();
  return useQuery(trpc.goals.getAll.queryOptions());
};

export const useUpdateGoals = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.goals.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.goals.pathFilter());
      },
    })
  );
};

export const useToggleGoal = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.goals.toggle.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.goals.pathFilter());
      },
    })
  );
};

export const useClearGoals = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.goals.clear.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.goals.pathFilter());
      },
    })
  );
};
