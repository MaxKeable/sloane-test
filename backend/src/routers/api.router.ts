import * as trpcExpress from "@trpc/server/adapters/express";
import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { logger } from "../../utils/logger";
import config from "../../config/index";
import { appApiRouter } from "./app-api.router";
import { adminApiRouter } from "./admin-api.router";
import { mcpApiRouter } from "./mcp-api.router";
import { createRequestContext } from "../middleware/auth.middleware";

const authMiddleware = requireAuth({
  publishableKey: config.CLERK_PUBLISHABLE_KEY,
  signInUrl: "/",
});

export const apiRouter = Router();

apiRouter.use(
  "/app",
  authMiddleware,
  trpcExpress.createExpressMiddleware({
    router: appApiRouter,
    createContext: createRequestContext,
    onError({ error, path, input, ctx, type, req }) {
      logger.error("Error occurred in App API:", {
        path,
        type,
        url: req.url,
        method: req.method,
        errorName: error.name,
        errorMessage: error.message,
        errorCode: (error as any).code,
        userId: (ctx as any)?.clerkUserId,
        stack: error.stack,
      });
    },
  })
);

apiRouter.use(
  "/admin",
  authMiddleware,
  trpcExpress.createExpressMiddleware({
    router: adminApiRouter,
    createContext: createRequestContext,
    onError({ error, path, input, ctx, type, req }) {
      logger.error("Error occurred in Admin API:", {
        path,
        type,
        url: req.url,
        method: req.method,
        errorName: error.name,
        errorMessage: error.message,
        errorCode: (error as any).code,
        userId: (ctx as any)?.clerkUserId,
        stack: error.stack,
      });
    },
  })
);

apiRouter.use(
  "/mcp",
  trpcExpress.createExpressMiddleware({
    router: mcpApiRouter,
    createContext: createRequestContext,
    onError({ error, path, input, ctx, type, req }) {
      logger.error("Error occurred in MCP API:", {
        path,
        type,
        url: req.url,
        method: req.method,
        errorName: error.name,
        errorMessage: error.message,
        errorCode: (error as any).code,
        userId: (ctx as any)?.clerkUserId,
        stack: error.stack,
      });
    },
  })
);
