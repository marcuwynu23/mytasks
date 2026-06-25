import { Router } from "express";
import { healthCheck } from "../controlllers/common/healthcheck.controller";
import apiRouter from "./api-router";

const router: Router = Router();

router.use("/api", apiRouter);
//health check
router.get(["/", "/health"], healthCheck);

export default router;
