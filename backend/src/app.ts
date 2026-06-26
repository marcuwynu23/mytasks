import dotenv from "dotenv";
import express, { Application } from "express";
dotenv.config();

import { setMiddleware } from "@/middlewares/middleware";
import router from "@/routes/index";

const app: Application = express();

// middlewares
setMiddleware(app);
// router configuration
app.use(router);

export default app;
