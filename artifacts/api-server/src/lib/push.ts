import { logger } from "./logger";

type PushPayload = {
  title: string;
  body: string;
  data?: Record<string, string>;
  badge?: number;
  icon?: string;
};

type PushResult = { success: boolean; sent: number; failed: number };

const deviceTokens = new Map<number, Set<string>>();

export function registerDeviceToken(userId: number, token: string): void {
  if (!deviceTokens.has(userId)) deviceTokens.set(userId, new Set());
  deviceTokens.get(userId)!.add(token);
}

export function unregisterDeviceToken(userId: number, token: string): void {
  deviceTokens.get(userId)?.delete(token);
}

export function getDeviceTokens(userId: number): string[] {
  return [...(deviceTokens.get(userId) ?? [])];
}

async function sendToToken(_token: string, _payload: PushPayload): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") return true;
  logger.warn("[PUSH] Push notification provider not configured");
  return false;
}

export const push = {
  async sendToUser(userId: number, payload: PushPayload): Promise<PushResult> {
    const tokens = getDeviceTokens(userId);
    if (tokens.length === 0) return { success: true, sent: 0, failed: 0 };

    let sent = 0;
    let failed = 0;
    await Promise.all(
      tokens.map(async (token) => {
        const ok = await sendToToken(token, payload);
        if (ok) sent++; else failed++;
      })
    );
    logger.info({ userId, sent, failed }, "[PUSH] Sent push notification");
    return { success: failed === 0, sent, failed };
  },

  async sendToUsers(userIds: number[], payload: PushPayload): Promise<PushResult> {
    const results = await Promise.all(userIds.map((uid) => this.sendToUser(uid, payload)));
    return { success: true, sent: results.reduce((s, r) => s + r.sent, 0), failed: results.reduce((s, r) => s + r.failed, 0) };
  },

  async broadcast(_payload: PushPayload): Promise<PushResult> {
    const userIds = [...deviceTokens.keys()];
    return this.sendToUsers(userIds, _payload);
  },
};

export default push;
