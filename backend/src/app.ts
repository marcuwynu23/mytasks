import dotenv from "dotenv";
import express, { Application } from "express";
dotenv.config();

import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { useCorsMiddleware } from "./middlewares/cors";
import router from "./routes/index";
import config from "./config/config";

const app: Application = express();

// middlewares
useCorsMiddleware(app);
app.use(express.json());
app.use(cookieParser());

// database
mongoose.connect(config.databaseURI).catch((err) => console.error("MongoDB connection error:", err));

// router configuration
app.use(router);

export default app;
