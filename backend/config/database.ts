import mongoose from "mongoose";
import { logger } from "../utils/logger";
import config from "./index";

export const connectToDb = async (): Promise<void> => {
  try {
    const connectionString =
      config.NODE_ENV === "production"
        ? config.MONGO_URI
        : config.DEV_MONGO_URI;

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    };

    await mongoose.connect(connectionString as string, options);
    logger.info("Database connected successfully");

    mongoose.connection.on("error", (err) => {
      logger.error("Database connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("Database disconnected");
    });
  } catch (error) {
    logger.error("Database connection failed:", error);
    process.exit(1);
  }
};
