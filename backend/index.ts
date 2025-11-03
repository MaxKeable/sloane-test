import express from "express";
import compression from "compression";
import helmet from "helmet";
// import rateLimit from "express-rate-limit";
import cors from "cors";
import { requireAuth } from "@clerk/express";
import { Server } from "socket.io";
import http from "http";
import apiRoutes from "./routes/index";
import { connectToDb } from "./config/database";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";
import config from "./config/index";
import { gracefulShutdown } from "./utils/gracefulShutdown";
import healthRoutes from "./routes/health";
import createUserRoute from "./routes/createNewUser";
import webhookRoutes from "./routes/webhook/index";
import { apiRouter as trpcApiRouter } from "./src/routers/api.router";
import { setSocketIO } from "./src/services/rag/stream.service";
import mcpTestRoutes from "./routes/mcp-test";
import prisma from "./config/client";

const app = express();
const server = http.createServer(app);

// Wrap server initialization in async function to properly await database connection
const initializeServer = async () => {
  try {
    logger.info("=".repeat(70));
    logger.info("🚀 AI Hub Backend Server Starting");
    logger.info("=".repeat(70));
    logger.info(`Environment: ${config.NODE_ENV}`);
    logger.info(`Port: ${process.env.PORT || config.PORT}`);
    logger.info(`Node Version: ${process.version}`);
    logger.info(`Process ID: ${process.pid}`);
    logger.info("=".repeat(70));

    // Connect to database with await to ensure it completes before starting server
    logger.info("Step 1: Connecting to MongoDB...");
    await connectToDb();

    // Verify Prisma client connection
    logger.info("Step 2: Verifying Prisma client connection...");
    try {
      await prisma.$connect();
      logger.info("✓ Prisma client connected successfully");
    } catch (error) {
      logger.error("✗ Failed to connect Prisma client:", error);
      throw error;
    }

    logger.info("Step 3: Initializing Express middleware...");
    initializeMiddleware();

    logger.info("Step 4: Setting up Socket.io...");
    initializeSocketIO();

    logger.info("Step 5: Starting HTTP server...");
    const port = process.env.PORT || config.PORT;

    server.listen(Number(port), () => {
      logger.info("=".repeat(70));
      logger.info("✓ Server Started Successfully!");
      logger.info(`🌐 Server listening on port ${port}`);
      logger.info(`🏥 Health check: http://localhost:${port}/health`);
      logger.info(`📡 Socket.io namespaces: /chat, /rag`);
      logger.info("=".repeat(70));
      logger.info("Server ready to accept connections");
      logger.info("=".repeat(70));
    });

    gracefulShutdown(server);
  } catch (error) {
    logger.error("=".repeat(70));
    logger.error("✗ Failed to initialize server:");
    logger.error(error);
    logger.error("=".repeat(70));
    process.exit(1);
  }
};

// Extract middleware initialization into a function
const initializeMiddleware = () => {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    })
  );
  app.use(compression());

  // const limiter = rateLimit({
  //   windowMs: 60000,
  //   max: 1000,
  //   message: "Too many requests, please try again later.",
  // });

  const corsOptions = {
    origin: "*",
    credentials: true,
  };

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cors(corsOptions));

  app.use("/health", healthRoutes);

  // app.use("/api", limiter);

  app.use("/create-user", createUserRoute);
  app.use("/api/webhook", webhookRoutes);
  app.use("/api/mcp-test", mcpTestRoutes);
  app.use("/trpc", trpcApiRouter);

  app.use(
    "/api",
    requireAuth({
      publishableKey: config.CLERK_PUBLISHABLE_KEY,
      signInUrl: "/",
    }),
    (err: any, req: any, res: any, next: any) => {
      if (err) {
        logger.error("Authentication error:", err);
        return res.status(401).json({ message: "Unauthenticated" });
      }
      next();
    },
    apiRoutes
  );

  app.use(errorHandler);
  logger.info("✓ Middleware and routes configured");
};

// Socket.io setup with namespaces - created at module level
export const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Export namespaces at module level (event handlers set up in initializeSocketIO)
export const chatNamespace = io.of("/chat");
export const ragNamespace = io.of("/rag");

// Initialize Socket.io
const initializeSocketIO = () => {
  // Chat namespace for traditional Expert/Assistant chats
  chatNamespace.on("connection", (socket) => {
    logger.info("Client connected to chat namespace");

    socket.on("joinRoom", (chatId: string) => {
      socket.join(chatId);
      logger.info(`Socket joined chat room: ${chatId}`);
    });

    socket.on("disconnect", () => {
      logger.info("Client disconnected from chat namespace");
    });
  });

  // RAG namespace for Playground chats
  ragNamespace.on("connection", (socket) => {
    logger.info("Client connected to RAG namespace");

    socket.on("joinRoom", (chatId: string) => {
      socket.join(chatId);
      logger.info(`Socket joined RAG room: ${chatId}`);
    });

    socket.on("disconnect", () => {
      logger.info("Client disconnected from RAG namespace");
    });
  });

  // Set RAG namespace for existing RAG service
  setSocketIO(ragNamespace);
  logger.info("✓ Socket.io namespaces configured (/chat, /rag)");
};

// Start the server
initializeServer().catch((error) => {
  logger.error("Fatal error during server initialization:");
  logger.error(error);
  process.exit(1);
});
