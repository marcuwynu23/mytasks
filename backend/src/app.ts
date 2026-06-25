import dotenv from "dotenv";
import express, { Application } from "express";
dotenv.config();

import { useCorsMiddleware } from "./middlewares/cors";
import router from "./routes/index";

const app: Application = express();

// middlewares
useCorsMiddleware(app);
// router configuration
app.use(router);

export default app;
