import { Server } from "http";
import mongoose from "mongoose";
import { logger } from "./logger";

export const gracefulShutdown = (server: Server) => {
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully`);

    server.close(async () => {
      logger.info("HTTP server closed");

      await mongoose.connection.close();
      logger.info("MongoDB connection closed");
      process.exit(0);
    });

    setTimeout(() => {
      logger.error(
        "Could not close connections in time, forcefully shutting down"
      );
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};
