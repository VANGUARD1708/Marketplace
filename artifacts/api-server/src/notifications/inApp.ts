import { db } from "@workspace/db";
import { notificationsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

export type NotificationType =
  | "escrow_funded"
  | "escrow_released"
  | "escrow_disputed"
  | "escrow_refunded"
  | "order_placed"
  | "order_confirmed"
  | "order_shipped"
  | "order_delivered"
  | "review_received"
  | "message_received"
  | "trust_score_updated"
  | "verification_approved"
  | "verification_rejected"
  | "new_follower"
  | "listing_sold"
  | "payout_processed"
  | "security_alert"
  | "system";

export interface NotificationPayload {
  userId: number;
  type: NotificationType;
  title: string;
  body: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export async function createNotification(payload: NotificationPayload) {
  const [notification] = await db.insert(notificationsTable).values({
    userId: payload.userId,
    type: payload.type,
    title: payload.title,
    body: payload.body,
    actionUrl: payload.actionUrl,
    metadata: payload.metadata ?? {},
    isRead: false,
  }).returning();
  return notification;
}

export async function getUserNotifications(userId: number, limit = 30, onlyUnread = false) {
  return db.query.notificationsTable.findMany({
    where: onlyUnread
      ? and(eq(notificationsTable.userId, userId), eq(notificationsTable.isRead, false))
      : eq(notificationsTable.userId, userId),
    orderBy: [desc(notificationsTable.createdAt)],
    limit,
  });
}

export async function markAsRead(notificationId: number) {
  await db.update(notificationsTable)
    .set({ isRead: true, readAt: new Date() })
    .where(eq(notificationsTable.id, notificationId));
}

export async function markAllAsRead(userId: number) {
  await db.update(notificationsTable)
    .set({ isRead: true, readAt: new Date() })
    .where(and(eq(notificationsTable.userId, userId), eq(notificationsTable.isRead, false)));
}

export async function unreadCount(userId: number): Promise<number> {
  const rows = await db.query.notificationsTable.findMany({
    where: and(eq(notificationsTable.userId, userId), eq(notificationsTable.isRead, false)),
  });
  return rows.length;
}

export const NOTIFICATION_TEMPLATES = {
  escrow_funded: (sellerName: string, amount: string) => ({
    title: "Escrow Funded",
    body: `${sellerName} has funded an escrow of ${amount}. Review and confirm.`,
  }),
  escrow_released: (amount: string) => ({
    title: "Payment Released",
    body: `${amount} has been released to your wallet from escrow.`,
  }),
  order_placed: (buyerName: string, listingTitle: string) => ({
    title: "New Order",
    body: `${buyerName} placed an order for "${listingTitle}".`,
  }),
  review_received: (rating: number) => ({
    title: "New Review",
    body: `You received a ${rating}-star review. Your trust score may have updated.`,
  }),
  new_follower: (username: string) => ({
    title: "New Follower",
    body: `@${username} started following you.`,
  }),
  verification_approved: () => ({
    title: "Verification Approved",
    body: "Your identity verification has been approved. Your trust score has been updated.",
  }),
} satisfies Partial<Record<NotificationType, (...args: string[]) => { title: string; body: string }>>;
