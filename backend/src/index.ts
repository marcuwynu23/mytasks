import dotenv from "dotenv";
import express from "express";
dotenv.config();

import { useCorsMiddleware } from "./middlewares/cors";
import router from "./routes/index";

const app = express();
const port = Number.parseInt(process.env.PORT as string) || 3000;
const host = process.env.HOST || "localhost";

// middlewares
useCorsMiddleware(app);

app.use(router);
app.listen(port, host, () => {
  console.log("Server is running on port 3000");
});
