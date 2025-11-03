import mongoose from "mongoose";
import { logger } from "../utils/logger";
import config from "./index";

export const connectToDb = async (): Promise<void> => {
  try {
    logger.info("=".repeat(50));
    logger.info("Database connection initializing...");

    const connectionString =
      config.NODE_ENV === "production"
        ? config.MONGO_URI
        : config.DEV_MONGO_URI;

    if (!connectionString) {
      throw new Error(
        `Database connection string not configured for ${config.NODE_ENV} environment`
      );
    }

    // Log masked connection string for debugging (hide credentials)
    const maskedUri = connectionString.replace(
      /:\/\/([^:]+):([^@]+)@/,
      "://*****:*****@"
    );
    logger.info(`Environment: ${config.NODE_ENV}`);
    logger.info(`Connection string: ${maskedUri}`);

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    };

    logger.info(`Connection timeout: ${options.serverSelectionTimeoutMS}ms`);
    logger.info(`Socket timeout: ${options.socketTimeoutMS}ms`);
    logger.info(`Max pool size: ${options.maxPoolSize}`);

    const startTime = Date.now();
    await mongoose.connect(connectionString as string, options);
    const duration = Date.now() - startTime;

    logger.info(`✓ Database connected successfully in ${duration}ms`);
    logger.info(`MongoDB connection state: ${mongoose.connection.readyState}`);
    logger.info(`Database name: ${mongoose.connection.db?.databaseName || "unknown"}`);
    logger.info(`MongoDB version: ${mongoose.version}`);
    logger.info("=".repeat(50));

    // Set up connection event listeners
    mongoose.connection.on("error", (err) => {
      logger.error("Database connection error:", {
        message: err.message,
        name: err.name,
        stack: err.stack,
      });
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("Database disconnected - attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("Database reconnected successfully");
    });

    mongoose.connection.on("close", () => {
      logger.info("Database connection closed");
    });
  } catch (error) {
    logger.error("=".repeat(50));
    logger.error("✗ Database connection FAILED:");
    logger.error(`Environment: ${config.NODE_ENV}`);
    logger.error(
      `Error type: ${error instanceof Error ? error.constructor.name : typeof error}`
    );
    logger.error(
      `Error message: ${error instanceof Error ? error.message : String(error)}`
    );
    if (error instanceof Error && error.stack) {
      logger.error("Stack trace:", error.stack);
    }
    logger.error("=".repeat(50));
    logger.error("Application cannot start without database connection. Exiting...");
    process.exit(1);
  }
};
