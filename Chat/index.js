import express from "express";
import https from "http";
import { setupWebSocket } from "./config/websocket.js";
import dotenv from "dotenv";
import { startServer } from "./config/graphql.js";
import cors from "cors";
import connectdb from "./config/db.js";

dotenv.config(); // for env
const app = express(); // for frontend server
app.use(
  cors({
    origin: "*",
  }),
);

connectdb(); // for database
startServer(app); // for gql

const server = https.createServer(app);
setupWebSocket(server);

// ================= START SERVER =================
server.listen(8080, () => {
  console.log("Server started on http://localhost:8080");
});
