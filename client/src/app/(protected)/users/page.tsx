// app/users/page.tsx (ou src/app/users/page.tsx)
"use client";

import UsersList from "@/components/UsersList/UsersList";
import { FloatingChatBox } from "@/components/chat"; // ← voir note plus bas

export default function UsersPage() {
  return (
    <div className="flex">
      <UsersList />
      <FloatingChatBox />
    </div>
  );
}
