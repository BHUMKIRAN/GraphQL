"use client";
import React, { useEffect, useRef, useState } from "react";

type Message = {
  message: string;
  username: string;
  time?: string;
};

const Page = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState("Connecting...");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 🔌 WebSocket connection with auto-reconnect
  useEffect(() => {
    let socket: WebSocket;

    const connect = () => {
      socket = new WebSocket("ws://localhost:8080");

      socket.onopen = () => {
        console.log("Connected");
        setStatus("Online");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages((prev) => [...prev, data]);
        } catch (err) {
          console.error("Invalid message format");
        }
      };

      socket.onclose = () => {
        console.log("Disconnected");
        setStatus("Reconnecting...");
        setTimeout(connect, 2000); // retry
      };

      socket.onerror = () => {
        socket.close();
      };

      setWs(socket);
    };

    connect();

    return () => socket?.close();
  }, []);

  // 📜 Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 📤 Send message
  const sendMessage = () => {
    if (!message.trim() || !username.trim()) return;

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          message,
          username,
          time: new Date().toLocaleTimeString(),
        })
      );
      setMessage("");
    }
  };

  return (
    <div className="h-[700px]  bg-gray-100 flex items-center justify-center ">
      {/* Mobile Container */}
      <div className="w-[500px] pt-5 max-w-sm bg-white shadow-lg flex flex-col rounded-xl overflow-hidden">

        {/* Header */}
        <div className="p-3 border-b text-center text-sm font-semibold">
          💬 Chat —{" "}
          <span
            className={`${
              status === "Online"
                ? "text-green-600"
                : status === "Reconnecting..."
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            {status}
          </span>
        </div>
          <div className="p-3">
            <input
              type="text"
              placeholder="Enter your name..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 text-sm border rounded-md outline-none"
            />
          </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-2 text-sm">
          {messages.map((msg, i) => {
            const isMe = msg.username === username;

            return (
              <div
                key={i}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-10 rounded-full  max-w-[75%] ${
                    isMe
                      ? "bg-[#b07818] text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {!isMe && (
                    <p className="text-[10px] opacity-60 mb-1">
                      {msg.username}
                    </p>
                  )}

                  <p className="break-words">{msg.message}</p>

                  {msg.time && (
                    <p className="text-[10px] opacity-60 mt-1 text-right">
                      {msg.time}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        {username && (
          <div className="p-2 border-t flex gap-2">
            <input
              type="text"
              placeholder="Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 p-2 text-sm border rounded-md outline-none"
            />

            <button
              onClick={sendMessage}
              className="px-3 text-sm bg-[#b07818] text-white rounded-md"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;