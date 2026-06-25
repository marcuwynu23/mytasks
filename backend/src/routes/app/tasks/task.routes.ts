import { Router } from "express";
import { createTask, deleteTask, getTask, getTasks, updateTask } from "@/controlllers/app/tasks/task.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const taskRouter: Router = Router();

taskRouter.use(authMiddleware);
taskRouter.get("/", getTasks);
taskRouter.post("/", createTask);
taskRouter.get("/:id", getTask);
taskRouter.put("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);

export default taskRouter;
