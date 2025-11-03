import winston from "winston";
import config from "../config/index";

// In production (Docker), log to stdout/stderr for container log collection
// In development, log to files and console
const logger = winston.createLogger({
  level: config.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports:
    config.NODE_ENV === "production"
      ? [
          // Production: Log to stdout/stderr (Docker best practice)
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            ),
          }),
        ]
      : [
          // Development: Log to files and console
          new winston.transports.File({ filename: "logs/error.log", level: "error" }),
          new winston.transports.File({ filename: "logs/combined.log" }),
          new winston.transports.Console({
            format: winston.format.simple(),
          }),
        ],
});

export { logger };
