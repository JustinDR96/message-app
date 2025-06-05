import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/messages?conversationId=xxx
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json(
      { message: "conversationId requis" },
      { status: 400 }
    );
  }

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

  return NextResponse.json(messages);
}

// POST /api/messages (JSON body: { text, conversationId })
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();
  const { text, conversationId } = body;

  if (!text || !conversationId) {
    return NextResponse.json(
      { message: "Texte ou conversationId manquant" },
      { status: 400 }
    );
  }

  const newMessage = await prisma.message.create({
    data: {
      text,
      userId: session.user.id,
      conversationId,
    },
    include: { user: true },
  });

  return NextResponse.json(newMessage);
}
