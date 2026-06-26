import crypto from "crypto";

type Session = {
  userId: number;
  createdAt: number;
  lastActiveAt: number;
  ip?: string;
  userAgent?: string;
};

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const sessions = new Map<string, Session>();

export function createSession(userId: number, ip?: string, userAgent?: string): string {
  const sessionId = crypto.randomBytes(32).toString("hex");
  sessions.set(sessionId, { userId, createdAt: Date.now(), lastActiveAt: Date.now(), ip, userAgent });
  return sessionId;
}

export function getSession(sessionId: string): Session | null {
  const session = sessions.get(sessionId);
  if (!session) return null;
  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    sessions.delete(sessionId);
    return null;
  }
  session.lastActiveAt = Date.now();
  return session;
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
}

export function deleteUserSessions(userId: number): void {
  for (const [id, session] of sessions.entries()) {
    if (session.userId === userId) sessions.delete(id);
  }
}

export function getUserSessions(userId: number): Array<{ sessionId: string } & Session> {
  const result: Array<{ sessionId: string } & Session> = [];
  for (const [sessionId, session] of sessions.entries()) {
    if (session.userId === userId) result.push({ sessionId, ...session });
  }
  return result;
}

export function pruneExpiredSessions(): number {
  let count = 0;
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now - session.createdAt > SESSION_TTL_MS) {
      sessions.delete(id);
      count++;
    }
  }
  return count;
}

export function sessionCount(): number {
  return sessions.size;
}
