import { Schema, model, Document, Types } from "mongoose";

export type TaskStatus = "pending" | "completed";

export interface ITask extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  userId: Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Task = model<ITask>("Task", taskSchema);
