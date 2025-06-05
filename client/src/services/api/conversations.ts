import { API_URL } from "@/constants/constants";

export async function createConversation(
  userId: string,
  participantId: string
) {
  const res = await fetch(`${API_URL}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, participantId }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Erreur création conversation");
  }

  return res.json();
}

export async function getOtherUser(conversationId: string, userId: string) {
  const res = await fetch(
    `${API_URL}/conversations/${conversationId}?userId=${userId}`
  );

  if (!res.ok) {
    throw new Error("Erreur chargement conversation");
  }

  return res.json(); // { user: ... }
}
