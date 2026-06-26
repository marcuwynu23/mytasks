import dotenv from "dotenv";
import express, { Application } from "express";
dotenv.config();

import cookieParser from "cookie-parser";
import morgan from "morgan";
import { useCorsMiddleware } from "@/middlewares/cors.middleware";
import router from "@/routes/index";

const app: Application = express();

// middlewares
useCorsMiddleware(app);
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// router configuration
app.use(router);

export default app;
