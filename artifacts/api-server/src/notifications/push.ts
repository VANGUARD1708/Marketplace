import { logger } from "../lib/logger";

const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY;
const FCM_BASE = "https://fcm.googleapis.com/fcm/send";

export interface PushPayload {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

export async function sendPushNotification(payload: PushPayload): Promise<boolean> {
  if (!FCM_SERVER_KEY) {
    logger.warn({ title: payload.title }, "[PUSH] FCM not configured — skipping");
    return false;
  }

  try {
    const res = await fetch(FCM_BASE, {
      method: "POST",
      headers: {
        Authorization: `key=${FCM_SERVER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: payload.token,
        notification: {
          title: payload.title,
          body: payload.body,
          image: payload.imageUrl,
        },
        data: payload.data ?? {},
      }),
    });
    const data = await res.json() as { success?: number; failure?: number };
    if (data.failure) {
      logger.error({ data, token: payload.token.slice(0, 10) }, "Push notification failed");
      return false;
    }
    return true;
  } catch (error) {
    logger.error({ error }, "Push notification error");
    return false;
  }
}

export async function sendPushToMultiple(tokens: string[], title: string, body: string, data?: Record<string, string>) {
  if (!FCM_SERVER_KEY) return;
  const results = await Promise.allSettled(tokens.map((t) => sendPushNotification({ token: t, title, body, data })));
  const sent = results.filter((r) => r.status === "fulfilled" && r.value).length;
  logger.info({ sent, total: tokens.length }, "Bulk push sent");
  return sent;
}
