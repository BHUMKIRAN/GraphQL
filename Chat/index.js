import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Track online users
const users = new Map(); // ✅ Correct initialization

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log(`${data.username} : ${data.message}`);

      // Add user to Map if not already
      if (!users.has(ws)) {
        users.set(ws, data.username);
        broadcastUsers();
      }

      // Broadcast chat message to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({ type: "chat", username: data.username, message: data.message })
          );
        }
      });
    } catch (err) {
      console.error("Invalid message format", err);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    users.delete(ws); // remove user
    broadcastUsers();
  });
});

// Function to broadcast online users
const broadcastUsers = () => {
  const usersArray = [...users.values()]; // list of usernames
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "onlineUsers", users: usersArray }));
    }
  });
};

server.listen(8080, () => {
  console.log("Server started on port 8080");
});