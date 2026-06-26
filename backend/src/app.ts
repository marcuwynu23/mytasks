import express, { type Application } from "express";
import { setMiddleware } from "@/middlewares/middleware";
import { setRouter } from "@/routes/router";

const app: Application = express();
// middlewares
setMiddleware(app);
// router
setRouter(app);

export default app;
