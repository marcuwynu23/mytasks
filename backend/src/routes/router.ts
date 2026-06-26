import { healthCheck } from "@/controlllers/common/healthcheck.controller";
import { Application, Router } from "express";
import apiRouter from "./api.router";

const router: Router = Router();
router.use("/api", apiRouter);
//health check
router.get(["/", "/health"], healthCheck);

export function setRouter(app: Application): void {
  app.use(router);
}
