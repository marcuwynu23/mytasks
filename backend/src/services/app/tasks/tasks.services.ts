import { Task } from "@/models/task.model";

export async function findAllTasks(userId: string) {
  return Task.find({ userId }).sort({ createdAt: -1 });
}

export async function findTask(id: string, userId: string) {
  return Task.findOne({ _id: id, userId });
}

export async function createTask(title: string, description: string, userId: string) {
  return Task.create({ title, description, userId });
}

export async function updateTask(id: string, userId: string, data: Record<string, unknown>) {
  return Task.findOneAndUpdate({ _id: id, userId }, { $set: data }, { returnDocument: "after", runValidators: true });
}

export async function deleteTask(id: string, userId: string) {
  return Task.findOneAndDelete({ _id: id, userId });
}
