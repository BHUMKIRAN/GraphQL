import express from "express";
import https from "http";
import dotenv from "dotenv";
import { startServer } from "./config/graphql.js";
import cors from "cors";
import connectdb from "./config/db.js";

dotenv.config(); // for env
const app = express(); // for frontend server
const server = https.createServer(app);
app.use(
  cors({
    origin: "*",
  }),
);

connectdb(); // for database
startServer(app); // for gql



server.listen(8080, () => {
  console.log("Server running on port 8080");
});
