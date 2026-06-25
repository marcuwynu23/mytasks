import { connectDatabase } from "./database/database";
import app from "./app";
import config from "./config/config";

connectDatabase();

app.listen(config.port, config.host, () => {
  console.log(`Server is running on ${config.host}:${config.port}`);
});
