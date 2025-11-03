import { Server } from "http";
import mongoose from "mongoose";
import { logger } from "./logger";
import prisma from "../config/client";

export const gracefulShutdown = (server: Server) => {
  const shutdown = async (signal: string) => {
    logger.info("=".repeat(70));
    logger.info(`Received ${signal} signal - initiating graceful shutdown`);
    logger.info("=".repeat(70));

    server.close(async () => {
      try {
        logger.info("Step 1/3: Closing HTTP server...");
        logger.info("✓ HTTP server closed successfully");

        logger.info("Step 2/3: Closing MongoDB connection...");
        await mongoose.connection.close();
        logger.info("✓ MongoDB connection closed successfully");

        logger.info("Step 3/3: Closing Prisma connection...");
        await prisma.$disconnect();
        logger.info("✓ Prisma connection closed successfully");

        logger.info("=".repeat(70));
        logger.info("✓ Graceful shutdown completed successfully");
        logger.info("=".repeat(70));
        process.exit(0);
      } catch (error) {
        logger.error("Error during graceful shutdown:", error);
        logger.error("Forcing shutdown due to errors");
        process.exit(1);
      }
    });

    // Force shutdown after timeout
    setTimeout(() => {
      logger.error("=".repeat(70));
      logger.error(
        "✗ Could not close connections within 10 seconds - forcing shutdown"
      );
      logger.error("=".repeat(70));
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Also handle uncaught exceptions and unhandled rejections
  process.on("uncaughtException", (error) => {
    logger.error("=".repeat(70));
    logger.error("✗ Uncaught Exception:", error);
    logger.error("=".repeat(70));
    shutdown("UNCAUGHT_EXCEPTION");
  });

  process.on("unhandledRejection", (reason, promise) => {
    logger.error("=".repeat(70));
    logger.error("✗ Unhandled Rejection at:", promise, "reason:", reason);
    logger.error("=".repeat(70));
    shutdown("UNHANDLED_REJECTION");
  });
};
