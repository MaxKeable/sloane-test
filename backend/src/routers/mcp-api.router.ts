import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { RequestContext } from "../model/types";
import { getBusinessContextService } from "../services/mcp/business/get-context.service";
import { getLastChatService } from "../services/mcp/chats/get-last-chat.service";
import {
  createActionRequestSchema,
  createActionService,
} from "../services/mcp/actions/create.service";

const { router, procedure: baseProcedure } = initTRPC
  .context<RequestContext>()
  .create({ transformer: superjson });

export const mcpApiRouter = router({
  getBusinessContext: baseProcedure.query(async () => {
    return await getBusinessContextService();
  }),
  getLastChat: baseProcedure.query(async () => {
    return await getLastChatService();
  }),
  createAction: baseProcedure
    .input(createActionRequestSchema)
    .mutation(async ({ input }) => {
      return await createActionService(input);
    }),
});

export type McpApiRouter = typeof mcpApiRouter;
