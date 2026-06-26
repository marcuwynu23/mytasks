import type { Response } from "express";
import type { AuthRequest } from "@/middlewares/auth.middleware";
import * as taskService from "@/services/app/tasks/tasks.services";

export async function getTasks(req: AuthRequest, res: Response): Promise<void> {
  res.json(await taskService.findAllTasks(req.userId!));
}

export async function getTask(req: AuthRequest, res: Response): Promise<void> {
  const task = await taskService.findTask(req.params.id, req.userId!);
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  res.json(task);
}

export async function createTask(req: AuthRequest, res: Response): Promise<void> {
  const { title, description, dueDate } = req.body;
  res.status(201).json(await taskService.createTask(title, description, req.userId!, dueDate));
}

export async function updateTask(req: AuthRequest, res: Response): Promise<void> {
  const task = await taskService.updateTask(req.params.id, req.userId!, req.body);
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  res.json(task);
}

export async function deleteTask(req: AuthRequest, res: Response): Promise<void> {
  const task = await taskService.deleteTask(req.params.id, req.userId!);
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  res.json({ message: "Task deleted" });
}
