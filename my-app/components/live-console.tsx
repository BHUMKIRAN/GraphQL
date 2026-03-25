"use client"; // important for using browser APIs like WebSocket

import { useEffect, useRef } from "react";

export default function LiveConsole() {
  const consoleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const consoleDiv = consoleRef.current;
    if (!consoleDiv) return;

    // Connect to WebSocket server
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      const p = document.createElement("div");
      p.textContent = `[${new Date().toLocaleTimeString()}] Connected to server`;
      consoleDiv.appendChild(p);
      consoleDiv.scrollTop = consoleDiv.scrollHeight;
    };

    ws.onmessage = (event) => {
      const p = document.createElement("div");
      p.textContent = `[${new Date().toLocaleTimeString()}] ${event.data}`;
      consoleDiv.appendChild(p);
      consoleDiv.scrollTop = consoleDiv.scrollHeight; // auto-scroll
    };

    ws.onclose = () => {
      const p = document.createElement("div");
      p.textContent = `[${new Date().toLocaleTimeString()}] Disconnected from server`;
      consoleDiv.appendChild(p);
      consoleDiv.scrollTop = consoleDiv.scrollHeight;
    };

    ws.onerror = (err) => {
      const p = document.createElement("div");
      p.textContent = `[${new Date().toLocaleTimeString()}] WebSocket error: ${err}`;
      consoleDiv.appendChild(p);
      consoleDiv.scrollTop = consoleDiv.scrollHeight;
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div
      ref={consoleRef}
      style={{
        position: "fixed",
        bottom: "10px",
        left: "10px",
        width: "400px",
        height: "200px",
        background: "#0b1b1a", // void
        color: "#fff18d", // cream
        fontFamily: "monospace",
        fontSize: "12px",
        padding: "10px",
        overflowY: "auto",
        border: "2px solid #b07818", // amber
        borderRadius: "8px",
        zIndex: 9999,
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
      }}
    />
  );
}