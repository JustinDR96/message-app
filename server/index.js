const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

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

app.use(cors());

// === Routes ====
app.post("/conversations", async (req, res) => {
  const { userId, participantId } = req.body;

  if (!userId || !participantId) {
    return res.status(400).json({ message: "userId et participantId requis" });
  }

  try {
    // Vérifie s'il existe déjà une conversation entre les deux
    const existing = await prisma.conversation.findFirst({
      where: {
        participants: {
          every: {
            id: { in: [userId, participantId] },
          },
        },
      },
      include: { participants: true },
    });

    if (existing && existing.participants.length === 2) {
      return res.json(existing);
    }

    // Sinon, crée la conversation
    const newConv = await prisma.conversation.create({
      data: {
        participants: {
          connect: [{ id: userId }, { id: participantId }],
        },
      },
    });

    return res.status(201).json(newConv);
  } catch (error) {
    console.error("Erreur création conversation :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.get("/conversations/:id", async (req, res) => {
  const conversationId = req.params.id;
  const userId = req.query.userId; // le frontend doit l'envoyer ici

  if (!userId) {
    return res.status(400).json({ message: "userId requis dans la query" });
  }

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation non trouvée" });
    }

    const otherUser = conversation.participants.find((u) => u.id !== userId);

    return res.json({ user: otherUser ?? null });
  } catch (error) {
    console.error("❌ Erreur GET /conversations/:id :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error("❌ Erreur /users :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.post("/update-profile", async (req, res) => {
  const { email, image } = req.body;

  if (!email || !image) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    await prisma.user.update({
      where: { email },
      data: { image },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("❌ Erreur update-profile :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });

    return res.status(201).json({ message: "Utilisateur créé" });
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return res.status(500).json({ message: "Erreur interne" });
  }
});

app.get("/messages", async (req, res) => {
  const { conversationId } = req.query;

  if (!conversationId) {
    return res.status(400).json({ message: "conversationId requis" });
  }

  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return res.json(messages);
  } catch (error) {
    console.error("❌ Erreur GET /messages :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.post("/messages", async (req, res) => {
  const { text, conversationId, userId } = req.body;

  if (!text || !conversationId || !userId) {
    return res
      .status(400)
      .json({ message: "text, conversationId et userId requis" });
  }

  try {
    const newMessage = await prisma.message.create({
      data: {
        text,
        userId,
        conversationId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Émission via socket (si tu veux que ce soit en temps réel)
    io.to(conversationId).emit("newMessage", newMessage);

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("❌ Erreur POST /messages :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Serveur Socket.IO prêt sur http://localhost:${PORT}`);
});
