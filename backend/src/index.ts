import dotenv from "dotenv";
import express from "express";
dotenv.config();

const app = express();
const port = Number.parseInt(process.env.PORT as string) || 3000;
const host = process.env.HOST || "localhost";

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, host, () => {
  console.log("Server is running on port 3000");
});
