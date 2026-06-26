import { apiFetch } from "@/lib/api";

export interface Conversation {
  id: number;
  participants: number[];
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  createdAt: string;
}

export const chatApi = {
  conversations: () => apiFetch<Conversation[]>("/chat/conversations"),

  messages: (conversationId: number, page = 1) =>
    apiFetch<{ items: Message[]; total: number }>(`/chat/conversations/${conversationId}/messages?page=${page}`),

  sendMessage: (conversationId: number, content: string) =>
    apiFetch<Message>(`/chat/conversations/${conversationId}/messages`, {
      method: "POST", body: JSON.stringify({ content }),
    }),

  startConversation: (userId: number, message: string) =>
    apiFetch<{ conversationId: number; message: Message }>("/chat/conversations", {
      method: "POST", body: JSON.stringify({ userId, message }),
    }),
};
