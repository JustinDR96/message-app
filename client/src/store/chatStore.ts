import { create } from "zustand";

type ChatBox = {
  userId: string;
  conversationId: string;
};

type ChatStore = {
  chats: ChatBox[];
  openChat: (chat: ChatBox) => void;
  closeChat: (userId: string) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  openChat: (chat) =>
    set((state) => {
      const exists = state.chats.some((c) => c.userId === chat.userId);
      if (exists) return state;
      return { chats: [...state.chats, chat] };
    }),
  closeChat: (userId) =>
    set((state) => ({
      chats: state.chats.filter((c) => c.userId !== userId),
    })),
}));
