"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useChatStore } from "@/store/chatStore";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "@/constants/constants";
import { getAllUsers } from "@/services/api/users";
import { createConversation } from "@/services/api/conversations";


const socket = io(SOCKET_URL);

type User = {
  id: string;
  email: string;
};

function UsersList() {
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
    queryFn: getAllUsers,
  });

  const mutation = useMutation({
    mutationFn: (participantId: string) =>
      createConversation(session!.user!.id, participantId),
    onSuccess: (conversation, participantId) => {
      openChat({ userId: participantId, conversationId: conversation.id });
    },
  });

  const handleClick = (participantId: string) => {
    mutation.mutate(participantId);
  };

  return (
    <div>
      <h2>Liste des utilisateurs</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.email}{" "}
            {onlineUserIds.includes(user.id) ? "🟢 Connecté" : "🔴 Déconnecté"}
            <button onClick={() => handleClick(user.id)}>Démarrer une conversation</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersList;
