import { API_URL } from "@/constants/constants";

export async function getMessages(conversationId: string) {
  const res = await fetch(
    `${API_URL}/messages?conversationId=${conversationId}`
  );
  if (!res.ok) throw new Error("Erreur chargement messages");
  return res.json(); // Message[]
}

export async function sendMessage(
  text: string,
  userId: string,
  conversationId: string
) {
  const res = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, userId, conversationId }),
  });

  if (!res.ok) throw new Error("Erreur envoi message");
  return res.json(); // Message
}
