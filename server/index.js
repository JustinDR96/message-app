const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // remplace par l’URL Vercel si nécessaire
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map(); // userId → socketId

io.on("connection", (socket) => {
  console.log("✅ Nouvelle connexion", socket.id);

  socket.on("userConnected", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    console.log(`✅ Utilisateur connecté: ${userId} avec socket ${socket.id}`);
  });

  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
  });

  socket.on("sendMessage", async (message) => {
    if (!message.text || !message.conversationId || !message.userId) return;

    try {
      const saved = await prisma.message.create({
        data: {
          text: message.text,
          conversationId: message.conversationId,
          userId: message.userId,
        },
        include: { user: true },
      });

      io.to(message.conversationId).emit("newMessage", saved);
    } catch (err) {
      console.error("❌ Erreur lors de la sauvegarde du message :", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Déconnexion", socket.id);

    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Serveur Socket.IO prêt sur http://localhost:${PORT}`);
});
