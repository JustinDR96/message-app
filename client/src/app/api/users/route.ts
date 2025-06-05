import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    where: { email: { not: session.user.email } },
    select: {
      id: true,
      email: true,
    },
  });

  return NextResponse.json(users);
}
