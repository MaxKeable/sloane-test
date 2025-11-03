import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import config from "../config/index";

export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

export const createError = (message: string, statusCode: number): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode = 500, message } = err;

  logger.error({
    error: err,
    request: {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    },
  });

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message:
      config.NODE_ENV === "production" && statusCode === 500
        ? "Internal server error"
        : message,
    ...(config.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
