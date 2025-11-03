import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { createError } from "./errorHandler";

export const validateRequestMiddleware = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      const zodError = error as any;
      const message = zodError.errors?.[0]?.message || "Validation failed";
      next(createError(message, 400));
    }
  };
};
