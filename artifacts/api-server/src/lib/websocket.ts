import { EventEmitter } from "events";
import { logger } from "./logger";

type WsClient = {
  id: string;
  userId: number;
  send: (data: unknown) => void;
  close: () => void;
};

type WsMessage = {
  type: string;
  payload: unknown;
};

class WebSocketManager extends EventEmitter {
  private clients = new Map<string, WsClient>();
  private userClients = new Map<number, Set<string>>();

  register(client: WsClient): void {
    this.clients.set(client.id, client);
    if (!this.userClients.has(client.userId)) this.userClients.set(client.userId, new Set());
    this.userClients.get(client.userId)!.add(client.id);
    logger.debug({ clientId: client.id, userId: client.userId }, "[WS] Client connected");
    this.emit("connect", client);
  }

  unregister(clientId: string): void {
    const client = this.clients.get(clientId);
    if (!client) return;
    this.clients.delete(clientId);
    this.userClients.get(client.userId)?.delete(clientId);
    logger.debug({ clientId, userId: client.userId }, "[WS] Client disconnected");
    this.emit("disconnect", client);
  }

  sendToClient(clientId: string, message: WsMessage): boolean {
    const client = this.clients.get(clientId);
    if (!client) return false;
    try { client.send(message); return true; } catch { return false; }
  }

  sendToUser(userId: number, message: WsMessage): number {
    const clientIds = this.userClients.get(userId) ?? new Set();
    let sent = 0;
    for (const id of clientIds) if (this.sendToClient(id, message)) sent++;
    return sent;
  }

  broadcast(message: WsMessage, excludeUserId?: number): number {
    let sent = 0;
    for (const client of this.clients.values()) {
      if (excludeUserId && client.userId === excludeUserId) continue;
      if (this.sendToClient(client.id, message)) sent++;
    }
    return sent;
  }

  sendToRoom(roomId: string, message: WsMessage): number {
    this.emit(`room:${roomId}`, message);
    return 0;
  }

  isOnline(userId: number): boolean {
    const clients = this.userClients.get(userId);
    return (clients?.size ?? 0) > 0;
  }

  getOnlineUserIds(): number[] {
    return [...this.userClients.entries()].filter(([, c]) => c.size > 0).map(([id]) => id);
  }

  clientCount(): number {
    return this.clients.size;
  }

  userCount(): number {
    return [...this.userClients.values()].filter((c) => c.size > 0).length;
  }
}

export const wsManager = new WebSocketManager();
export default wsManager;
