import { apiFetch } from "@/lib/api";

export interface Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationsApi = {
  list: (onlyUnread = false) =>
    apiFetch<Notification[]>(`/notifications${onlyUnread ? "?unread=true" : ""}`),

  markRead: (id: number) =>
    apiFetch<{ success: boolean }>(`/notifications/${id}/read`, { method: "POST" }),

  markAllRead: () =>
    apiFetch<{ success: boolean }>("/notifications/read-all", { method: "POST" }),

  unreadCount: () => apiFetch<{ count: number }>("/notifications/unread-count"),
};
