import { createTRPCClient, httpLink, type TRPCClient } from "@trpc/client";
import type { McpApiRouter } from "backend/api";
import superjson from "superjson";

const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:3001";
const trpcUrl = `${apiBaseUrl}/trpc/mcp`;

console.log(`[tRPC Client] Initializing with URL: ${trpcUrl}`);

export const trpcClient: TRPCClient<McpApiRouter> =
  createTRPCClient<McpApiRouter>({
    links: [
      httpLink({
        url: trpcUrl,
        transformer: superjson,
      }),
    ],
  });
