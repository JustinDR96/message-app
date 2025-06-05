// client/services/api/userImage.ts
import { API_URL } from "@/constants/constants";

export async function updateUserImage(email: string, image: string) {
  const res = await fetch(`${API_URL}/update-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, image }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Erreur mise à jour image");
  }
}
