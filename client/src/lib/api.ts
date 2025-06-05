// client/lib/api.ts
export async function createConversation(
  userId: string,
  participantId: string
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, participantId }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Erreur serveur");
  }

  return res.json();
}
