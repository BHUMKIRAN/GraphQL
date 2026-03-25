// wsServer.js
import { WebSocketServer } from "ws";

// Track online users
const users = new Map();

export const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  const broadcastUsers = () => {
    const usersArray = [...users.values()];
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "onlineUsers", users: usersArray }));
      }
    });
  };

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log(`${data.username} : ${data.message}`);

        // store user if new
        if (!users.has(ws)) {
          users.set(ws, data.username);
          broadcastUsers();
        }

        // broadcast chat to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "chat",
                username: data.username,
                message: data.message,
              })
            );
          }
        });
      } catch (err) {
        console.error("Invalid message format", err);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      users.delete(ws);
      broadcastUsers();
    });
  });

  return wss;
};