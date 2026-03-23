"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]); // new state for online users

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => console.log("Connected to server");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "chat") {
          // Add chat message to log
          setChatLog((prev) => [...prev, `${data.username}: ${data.message}`]);
        } else if (data.type === "onlineUsers") {
          // Update online users list
          setOnlineUsers(data.users);
        }
      } catch (err) {
        console.error("Invalid data from server", err);
      }
    };

    ws.onclose = () => console.log("Disconnected from server");

    setSocket(ws);

    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (!username) return alert("Enter username first");
    if (!message) return;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ username, message }));
      setMessage("");
    }
  };

  return (
    <div className="p-10 flex gap-10">
      {/* Chat column */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Chat Room</h1>

        <div className="mb-4">
          <input
            className="border p-2 mr-2"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="border p-4 h-64 overflow-y-auto mb-4">
          {chatLog.map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
        </div>

        <input
          className="border p-2 mr-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>

      {/* Online users column */}
      <div className="w-52">
        <h2 className="text-xl font-bold mb-2">Online Users</h2>
        <ul className="border p-4 h-64 overflow-y-auto">
          {onlineUsers.map((user, idx) => (
            <li key={idx}>{user}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}