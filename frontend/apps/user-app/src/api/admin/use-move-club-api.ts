import { useAdminTRPC } from "../../providers/admin-api-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type MoveClubWithRegistrationsWithUser = ReturnType<
  typeof useGetOneMoveClub
>["data"];

export const useGetMoveClubs = () => {
  const trpc = useAdminTRPC();
  return useQuery(trpc.moveClubs.getAll.queryOptions());
};

export const useCreateMoveClub = () => {
  const trpc = useAdminTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.moveClubs.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.moveClubs.pathFilter());
      },
    })
  );
};

export const useUpdateMoveClub = () => {
  const trpc = useAdminTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.moveClubs.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.moveClubs.pathFilter());
      },
    })
  );
};

export const useGetOneMoveClub = (id: string) => {
  const trpc = useAdminTRPC();
  return useQuery(trpc.moveClubs.getOne.queryOptions({ id }));
};

export const useDeleteMoveClub = () => {
  const trpc = useAdminTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.moveClubs.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.moveClubs.pathFilter());
      },
    })
  );
};
