"use client";

import Chat from "@/components/chat/Chat";
import { useChatStore } from "@/store/chatStore";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FloatingChatBox() {
  const { chats, closeChat } = useChatStore();

  return (
    <div className="fixed bottom-4 right-4 flex flex-row gap-4 z-50">
      {chats.map((chat) => (
        <div
          key={chat.userId}
          className="w-[320px] shadow-lg border rounded-xl bg-white"
        >
          <div className="flex justify-end items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => closeChat(chat.userId)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Chat conversationId={chat.conversationId} />
        </div>
      ))}
    </div>
  );
}
