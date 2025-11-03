import { useQuery } from "@tanstack/react-query";
import { useAdminTRPC } from "../../providers/admin-api-provider";

export const useGetUsers = () => {
  const trpc = useAdminTRPC();
  return useQuery(trpc.users.getAll.queryOptions());
};
