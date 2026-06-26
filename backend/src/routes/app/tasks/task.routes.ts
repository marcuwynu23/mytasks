import { Router } from "express";
import { createTask, deleteTask, getTask, getTasks, updateTask } from "@/controlllers/app/tasks/task.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { createTaskSchema, updateTaskSchema } from "@/validations/task.validation";

const taskRouter: Router = Router();

taskRouter.use(authMiddleware);
taskRouter.get("/", getTasks);
taskRouter.post("/", validate(createTaskSchema), createTask);
taskRouter.get("/:id", getTask);
taskRouter.put("/:id", validate(updateTaskSchema), updateTask);
taskRouter.delete("/:id", deleteTask);

export default taskRouter;
