import { createServer } from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map(); // userId → socketId

io.on("connection", (socket) => {
  console.log("✅ Nouvelle connexion", socket.id);

  // Quand un user s'identifie après connexion
  socket.on("userConnected", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    console.log(`✅ Utilisateur connecté: ${userId} avec socket ${socket.id}`);
  });

  // Lorsqu'un utilisateur rejoint une conversation
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
  });

  // Lorsqu'un message est envoyé
  socket.on("sendMessage", async (message) => {
    if (!message.text || !message.conversationId || !message.userId) return;

    const saved = await prisma.message.create({
      data: {
        text: message.text,
        conversationId: message.conversationId,
        userId: message.userId,
      },
      include: { user: true },
    });

    io.to(message.conversationId).emit("newMessage", saved);
  });

  // Lorsqu'un utilisateur se déconnecte
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

httpServer.listen(3001, () => {
  console.log("🚀 Socket.IO server running on http://localhost:3001");
});
