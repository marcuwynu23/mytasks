import dotenv from "dotenv";
import express, { Application } from "express";
dotenv.config();

import cookieParser from "cookie-parser";
import { useCorsMiddleware } from "@/middlewares/cors.middleware";
import router from "@/routes/index";

const app: Application = express();

// middlewares
useCorsMiddleware(app);
app.use(express.json());
app.use(cookieParser());

// router configuration
app.use(router);

export default app;
