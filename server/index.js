// server/index.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // ou mets l’URL de ton frontend Vercel en prod
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Nouvelle connexion :", socket.id);

  socket.on("message", (data) => {
    console.log("Message reçu:", data);
    socket.broadcast.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("Déconnexion :", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Serveur Socket.IO sur le port ${PORT}`);
});
