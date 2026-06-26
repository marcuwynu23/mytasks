import { setMiddleware } from "@/middlewares/middleware";
import { setRouter } from "@/routes/router";
import express, { Application } from "express";

const app: Application = express();
// middlewares
setMiddleware(app);
// router
setRouter(app);

export default app;
