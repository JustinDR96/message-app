import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();
  const { participantId } = body;

  if (!participantId) {
    return NextResponse.json(
      { message: "participantId requis" },
      { status: 400 }
    );
  }

  // 1. Vérifie si une conversation existe déjà (2 participants exacts)
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      participants: {
        every: {
          id: { in: [session.user.id, participantId] },
        },
      },
    },
    include: { participants: true },
  });

  if (existingConversation && existingConversation.participants.length === 2) {
    return NextResponse.json(existingConversation);
  }

  // 2. Sinon, crée une nouvelle conversation
  const newConversation = await prisma.conversation.create({
    data: {
      participants: {
        connect: [{ id: session.user.id }, { id: participantId }],
      },
    },
  });

  return NextResponse.json(newConversation);
}
