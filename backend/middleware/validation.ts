import { ZodType, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { createError } from "./errorHandler";

export const validateRequest = <
  TBody = any,
  TQuery extends ParsedQs = ParsedQs,
  TParams extends ParamsDictionary = ParamsDictionary,
>(schema: {
  body?: ZodType<TBody>;
  query?: ZodType<TQuery>;
  params?: ZodType<TParams>;
}) => {
  return (
    req: Request<TParams, any, TBody, TQuery>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query) as TQuery;
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params) as TParams;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message || "Validation failed";
        next(createError(message, 400));
      } else {
        next(createError("Validation failed", 400));
      }
    }
  };
};
