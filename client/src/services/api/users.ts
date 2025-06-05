import { API_URL } from "@/constants/constants";

export async function getAllUsers() {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) throw new Error("Erreur chargement utilisateurs");
  return res.json(); // User[]
}
