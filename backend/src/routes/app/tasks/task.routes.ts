import { Router } from "express";
import { getTasks } from "../../../controlllers/app/tasks/task.controller";

const taskRouter: Router = Router();

taskRouter.get("/", getTasks);

export default taskRouter;
