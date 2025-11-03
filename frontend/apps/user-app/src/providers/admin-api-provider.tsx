import { useAuth } from "@clerk/clerk-react";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import superjson from "superjson";
import { useQueryClient } from "@tanstack/react-query";
import { AdminApiRouter } from "@backend/src/routers/admin-api.router";

export const {
  TRPCProvider: AdminTRPCProvider,
  useTRPC: useAdminTRPC,
  useTRPCClient: useAdminTRPCClient,
} = createTRPCContext<AdminApiRouter>();

export const AdminApiProvider = ({ children }: PropsWithChildren) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AdminApiRouter>({
      links: [
        httpBatchLink({
          url: `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"}/trpc/admin`,
          transformer: superjson,
          headers() {
            return (async () => {
              const token = await getToken();
              if (token) {
                return {
                  authorization: `Bearer ${token}`,
                };
              }
              return {};
            })();
          },
        }),
      ],
    })
  );

  return (
    <AdminTRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      {children}
    </AdminTRPCProvider>
  );
};
