import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAdminTRPC } from "../../providers/admin-api-provider";

export const useGetFeatureFlags = () => {
  const trpc = useAdminTRPC();
  return useQuery(trpc.featureFlags.getAll.queryOptions());
};

export const useUpdateFeatureFlag = () => {
  const trpc = useAdminTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.featureFlags.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.featureFlags.pathFilter());
      },
    })
  );
};

export const useSeedFeatureFlags = () => {
  const trpc = useAdminTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.featureFlags.seed.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.featureFlags.pathFilter());
      },
    })
  );
};
