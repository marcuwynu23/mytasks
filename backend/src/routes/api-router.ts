import { Router } from "express";
import authRouter from "./app/auth/auth.route";
import taskRouter from "./app/tasks/task.routes";

const apiRouter: Router = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/tasks", taskRouter);

export default apiRouter;
