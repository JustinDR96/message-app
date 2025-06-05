
export async function getCurrentUserId(): Promise<string | null> {
  const res = await fetch("api/me");
  if (!res.ok) return null;
  const data = await res.json();
  return data.userId;
}
