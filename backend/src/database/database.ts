import mongoose from "mongoose";
import config from "../config/config";

export async function connectDatabase(): Promise<typeof mongoose> {
  const connection = await mongoose.connect(config.databaseURI);
  console.log(`MongoDB connected: ${connection.connection.host}`);
  return connection;
}
