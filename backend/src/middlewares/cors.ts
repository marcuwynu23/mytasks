import cors, { CorsOptions } from "cors";
import { Application } from "express";

export function useCorsMiddleware(app: Application): void {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()) ?? [];

  const corsOptions: CorsOptions = {
    origin: (origin: any, callback: any) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  };

  app.use(cors(corsOptions));
}
