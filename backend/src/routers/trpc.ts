import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { RequestContext } from "../model/types";

const t = initTRPC.context<RequestContext>().create({ transformer: superjson });

export const router = t.router;
export const publicProcedure = t.procedure;

export const procedure = publicProcedure.use(async (opts) => {
  if (!opts.ctx.clerkUserId || !opts.ctx.isAuthenticated) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next(opts);
});
