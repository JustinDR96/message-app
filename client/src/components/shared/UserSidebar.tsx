"use client";

import { useQuery } from "@tanstack/react-query";
import { useChatStore } from "@/store/chatStore";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import UserItem from "@/components/chat/UserItem";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL, API_URL } from "@/constants/constants";

type User = {
  id: string;
  email: string;
};

export default function UserSidebar() {
  const { openChat } = useChatStore();
  const { data: session, status } = useSession();
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;

    const socket = io(SOCKET_URL);
    socket.emit("userConnected", session.user.id);

    socket.on("onlineUsers", (ids: string[]) => {
      setOnlineUserIds(ids);
    });

    return () => {
      socket.disconnect();
    };
  }, [status, session]);

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/users`);
      if (!res.ok)
        throw new Error("Erreur lors du chargement des utilisateurs");
      return res.json();
    },
  });

  const handleClick = async (userId: string) => {
    const res = await fetch(`${API_URL}/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId: userId }),
    });

    if (!res.ok)
      throw new Error("Erreur lors de la création de la conversation");

    const conversation = await res.json();
    openChat({ userId, conversationId: conversation.id });
  };

  return (
    <aside className="fixed top--56 right-0 w-64 h-full bg-white border-l p-4 space-y-2 z-40">
      <h2 className="text-lg font-semibold mb-4">Utilisateurs</h2>
      {users.map((user) => (
        <UserItem
          key={user.id}
          user={user}
          isOnline={onlineUserIds.includes(user.id)}
          onClick={() => handleClick(user.id)}
        />
      ))}
    </aside>
  );
}
