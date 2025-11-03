import { useTRPC } from "@/providers/api-provider";
import { useQuery } from "@tanstack/react-query";

export const useFeatureFlag = () => {
  const trpc = useTRPC();
  return useQuery(trpc.featureFlags.getAll.queryOptions());
};
