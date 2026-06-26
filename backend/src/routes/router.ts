import { type Application, Router } from "express";
import { healthCheck } from "@/controllers/common/healthcheck.controller";

import authRouter from "./app/auth/auth.route";
import taskRouter from "./app/tasks/task.routes";

const apiRouter: Router = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/tasks", taskRouter);

const router: Router = Router();
router.use("/api", apiRouter);
router.get(["/", "/health"], healthCheck);

export function setRouter(app: Application): void {
  app.use(router);
}
