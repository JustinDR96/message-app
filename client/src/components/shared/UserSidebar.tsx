"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useChatStore } from "@/store/chatStore";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "@/constants/constants";
import UserItem from "@/components/chat/UserItem";
import { getAllUsers } from "@/services/api/users";
import { createConversation } from "@/services/api/conversations";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SidebarTrigger />
      </SidebarInset>
    </SidebarProvider>
  );
}
