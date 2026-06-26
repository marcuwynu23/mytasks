import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodSchema } from "zod";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.issues.map((e) => e.message).join(", ");
        res.status(400).json({ message });
        return;
      }
      next(err);
    }
  };
}
