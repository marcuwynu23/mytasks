import app from "./app";
import config from "./config/config";
import { connectDatabase } from "./database/database";

async function start() {
  await connectDatabase();
  app.listen(config.port, config.host, () => {
    console.log(`Server is running on ${config.host}:${config.port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
