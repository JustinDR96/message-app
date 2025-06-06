"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useChatStore } from "@/store/chatStore";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "@/constants/constants";
import { getAllUsers } from "@/services/api/users";
import { createConversation } from "@/services/api/conversations";

type User = {
  id: string;
  email: string;
};

function UsersList() {
  const { openChat } = useChatStore();
  const { data: session, status } = useSession();
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  useEffect(() => {
    // Par celle-ci
    if (
      status !== "authenticated" ||
      !session ||
      !session.user ||
      !session.user.id
    )
      return;

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
    <div className="h-screen">
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => handleClick(user.id)}>
            <div className="cursor-pointer items-center flex justify-between p-2">
              <p>{user.email}</p>
              <p>{onlineUserIds.includes(user.id) ? "🟢" : "🔴"}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersList;
