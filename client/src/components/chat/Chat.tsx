"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SOCKET_URL, API_URL } from "@/constants/constants";

type Message = {
  id: string;
  text: string;
  createdAt: string;
  userId: string;
  user: {
    email: string;
    id: string;
    name?: string;
    image?: string;
  };
};

type Props = {
  conversationId: string;
};

export default function Chat({ conversationId }: Props) {
  const { data: session } = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<{
    name?: string;
    email: string;
    image?: string;
  } | null>(null);

  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // GET messages via API backend
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/messages?conversationId=${conversationId}`
      );
      if (!res.ok) throw new Error("Erreur chargement messages");
      return res.json();
    },
    enabled: !!conversationId,
  });

  const { register, handleSubmit, reset } = useForm<{ text: string }>();

  useEffect(() => {
    if (!conversationId || !userId) return;

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.emit("joinConversation", conversationId);

    socket.on("connect", () => {
      console.log("✅ Connecté au serveur de chat");
    });

    socket.on("newMessage", () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    });

    return () => {
      socket.disconnect();
    };
  }, [conversationId, userId, queryClient]);

  const onSubmit = (data: { text: string }) => {
    if (!userId || !data.text.trim()) return;

    socketRef.current?.emit("sendMessage", {
      text: data.text,
      conversationId,
      userId,
    });

    reset();
  };

  useEffect(() => {
    // GET userId depuis backend
    fetch(`${API_URL}/me`)
      .then((res) => res.json())
      .then((data) => setUserId(data.userId))
      .catch(() => setUserId(null));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetch(`${API_URL}/conversations/${conversationId}`)
      .then((res) => res.json())
      .then((data) => setOtherUser(data.user))
      .catch(() => setOtherUser(null));
  }, [conversationId]);

  return (
    <Card className="flex flex-col h-[600px] border-0 shadow-none">
      <CardHeader>
        <CardTitle>
          {otherUser?.name ?? otherUser?.email ?? "utilisateur inconnu"}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-2">
          {messages.map((msg) => {
            const isMine = msg.userId === userId;
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex items-center gap-2",
                  isMine ? "justify-end" : "justify-start"
                )}
              >
                {!isMine && (
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={msg.user.image ?? ""} />
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-xs rounded mb-2 px-3 py-2 text-sm",
                    isMine
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <p>{msg.text}</p>
                </div>
                {isMine && (
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={session?.user?.image ?? ""} />
                    <AvatarFallback>
                      {session?.user?.name?.[0] ?? session?.user?.email?.[0]}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex gap-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-2 w-full items-center"
        >
          <Input {...register("text")} placeholder="Écris ton message..." />
          <Button type="submit" size="icon">
            <SendHorizonal className="w-4 h-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
