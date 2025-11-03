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

const app = express();
const server = http.createServer(app);

connectToDb();

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

// Socket.io setup with namespaces
export const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Chat namespace for traditional Expert/Assistant chats
export const chatNamespace = io.of("/chat");
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
export const ragNamespace = io.of("/rag");
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

const port = process.env.PORT || config.PORT;

server.listen(Number(port), () => {
  logger.info(`Server listening on port ${port}`);
});

gracefulShutdown(server);
