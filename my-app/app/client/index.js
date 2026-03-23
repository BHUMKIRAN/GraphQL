import React from 'react';

const Clients = () => {
  const socket = new WebSocket("ws://localhost:8080");

  socket.onopen =() => {
    console.log("connected to server");
  };    

  socket.onmessage=(message) => {
    console.log(message.data);
  };

  socket.onclose =() => {
    console.log("disconnected from server");
  };

  return (
    <div>
      hi from client
    </div>
  );
};

export default Clients;