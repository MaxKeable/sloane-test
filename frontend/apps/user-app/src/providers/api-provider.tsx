import { useAuth } from "@clerk/clerk-react";
import type { AppApiRouter } from "@backend/api";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import superjson from "superjson";
import { useQueryClient } from "@tanstack/react-query";

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppApiRouter>();

export const ApiProvider = ({ children }: PropsWithChildren) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [trpcClient] = useState(() => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
    console.log("🔍 API Provider URL:", `${apiUrl}/trpc/app`);
    console.log("🔍 Raw VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);

    return createTRPCClient<AppApiRouter>({
      links: [
        httpBatchLink({
          url: `${apiUrl}/trpc/app`,
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
    });
  });

  return (
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      {children}
    </TRPCProvider>
  );
};
