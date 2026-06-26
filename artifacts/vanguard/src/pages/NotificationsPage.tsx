import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell, MessageSquare, ShoppingBag, Shield, Star, CheckCircle,
  TrendingUp, Users, Wallet, Briefcase, Loader2, Check,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type Notification = {
  id: number; type: string; title: string; body: string;
  actionUrl?: string; isRead: boolean; createdAt: string;
};

const TYPE_ICONS: Record<string, typeof Bell> = {
  message_received: MessageSquare,
  order_placed: ShoppingBag,
  order_confirmed: ShoppingBag,
  escrow_funded: Shield,
  escrow_released: Wallet,
  trust_score_updated: Star,
  new_follower: Users,
  verification_approved: CheckCircle,
  listing_sold: TrendingUp,
  payout_processed: Wallet,
  security_alert: Shield,
  job_match: Briefcase,
};

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

const FILTERS = ["All", "Messages", "Orders", "Trust", "Wallet", "Security"];

export default function NotificationsPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("All");

  const ME = 1;

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", ME],
    queryFn: () => apiFetch<Notification[]>(`/notifications?userId=${ME}`),
  });

  const markRead = useMutation({
    mutationFn: (id: number) => apiFetch(`/notifications/${id}/read`, { method: "PATCH" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications", ME] }),
  });

  const markAllRead = useMutation({
    mutationFn: () => apiFetch("/notifications/read-all", { method: "POST", body: JSON.stringify({ userId: ME }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications", ME] }),
  });

  const FILTER_MAP: Record<string, string[]> = {
    Messages: ["message_received"],
    Orders: ["order_placed", "order_confirmed", "order_shipped", "order_delivered", "listing_sold"],
    Trust: ["trust_score_updated", "verification_approved", "new_follower"],
    Wallet: ["escrow_funded", "escrow_released", "escrow_refunded", "payout_processed"],
    Security: ["security_alert", "fraud_alert"],
  };

  const filtered = filter === "All"
    ? notifications
    : notifications.filter((n) => FILTER_MAP[filter]?.includes(n.type));

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">Stay updated with your Vanguard activity</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <Check className="h-4 w-4" /> Mark all read
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total", value: notifications.length },
          { label: "Unread", value: unreadCount },
          { label: "Today", value: notifications.filter((n) => new Date(n.createdAt).toDateString() === new Date().toDateString()).length },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-3 text-center">
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
              filter === f ? "bg-primary text-primary-foreground" : "border hover:bg-muted"
            }`}>
            {f}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Notification list */}
      <div className="space-y-2">
        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Bell className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium">No notifications</p>
            <p className="text-sm text-muted-foreground">We'll notify you when something happens.</p>
          </div>
        )}
        {filtered.map((n) => {
          const Icon = TYPE_ICONS[n.type] ?? Bell;
          return (
            <div key={n.id}
              onClick={() => !n.isRead && markRead.mutate(n.id)}
              className={`rounded-xl border p-4 flex gap-3 transition cursor-pointer hover:shadow-sm ${
                n.isRead ? "bg-card" : "bg-primary/5 border-primary/20"
              }`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${n.isRead ? "bg-muted" : "bg-primary/10"}`}>
                <Icon className={`h-5 w-5 ${n.isRead ? "text-muted-foreground" : "text-primary"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-medium ${!n.isRead ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{timeAgo(n.createdAt)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{n.body}</p>
              </div>
              {!n.isRead && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
