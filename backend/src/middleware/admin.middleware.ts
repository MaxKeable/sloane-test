import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/express";
import type { RequestContext } from "../model/types";

export const createAdminContext = async (
  ctx: RequestContext
): Promise<RequestContext> => {
  if (!ctx.clerkUserId || !ctx.isAuthenticated) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  try {
    const user = await clerkClient.users.getUser(ctx.clerkUserId);

    if (user.publicMetadata.account !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Unauthorized. This action is restricted to admin users.",
      });
    }

    return ctx;
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    console.error("Error verifying admin user:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error verifying user session",
    });
  }
};
