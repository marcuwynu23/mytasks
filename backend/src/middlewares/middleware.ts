import cookieParser from "cookie-parser";
import express, { Application } from "express";
import morgan from "morgan";
import { useCorsMiddleware } from "./cors.middleware";

export function setMiddleware(app: Application): void {
  // cors
  useCorsMiddleware(app);
  // body json parsing
  app.use(express.json());
  // cookie parser
  app.use(cookieParser());
  // morgan logging
  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }
}
