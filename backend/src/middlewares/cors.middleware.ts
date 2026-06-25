import cors, { CorsOptions } from "cors";
import { Application } from "express";
import config from "@/config/config";

export function useCorsMiddleware(app: Application): void {
  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      if (!origin || config.allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  };

  app.use(cors(corsOptions));
}
