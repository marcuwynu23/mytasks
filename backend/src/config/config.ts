import dotenv from "dotenv";

dotenv.config();

const config = {
  port: Number.parseInt(process.env.PORT ?? "5000", 10),
  host: process.env.HOST ?? "0.0.0.0",

  allowedOrigins: process.env.ALLOWED_ORIGINS ? (JSON.parse(process.env.ALLOWED_ORIGINS) as string[]) : [],

  databaseURI: process.env.MONGODB_URI ?? "mongodb://localhost:27017/task-management",

  jwt: {
    secret: process.env.JWT_SECRET ?? "",
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  },
};

export default config;
