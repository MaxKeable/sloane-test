import { useTRPC } from "@/providers/api-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type MoveClubWithRegistration = ReturnType<
  typeof useGetNextMoveClub
>["data"];

export const useGetNextMoveClub = () => {
  const trpc = useTRPC();
  return useQuery(trpc.moveClubs.getNext.queryOptions());
};

export const useCreateMoveClubRegistration = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.moveClubs.createRegistration.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.moveClubs.pathFilter());
      },
    })
  );
};

export const useUpdateMoveClubRegistration = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.moveClubs.updateRegistration.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.moveClubs.pathFilter());
      },
    })
  );
};
