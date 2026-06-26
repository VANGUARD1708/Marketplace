import { EventEmitter } from "events";

export type VanguardEvents = {
  "user.registered": { userId: number; email: string };
  "user.verified": { userId: number; type: string };
  "listing.created": { listingId: number; sellerId: number; title: string };
  "listing.sold": { listingId: number; buyerId: number; sellerId: number };
  "escrow.created": { escrowId: number; buyerId: number; sellerId: number; amount: string };
  "escrow.released": { escrowId: number; sellerId: number; amount: string };
  "escrow.disputed": { escrowId: number; initiatorId: number; reason: string };
  "order.placed": { orderId: number; buyerId: number; sellerId: number };
  "order.delivered": { orderId: number };
  "trust.updated": { userId: number; oldScore: number; newScore: number; reason: string };
  "notification.send": { userId: number; type: string; title: string; body?: string };
  "guardian.alert": { severity: string; type: string; description: string; targetId?: number };
  "message.sent": { fromUserId: number; toUserId: number; conversationId: number };
};

class TypedEventEmitter extends EventEmitter {
  emit<K extends keyof VanguardEvents>(event: K, data: VanguardEvents[K]): boolean {
    return super.emit(event as string, data);
  }

  on<K extends keyof VanguardEvents>(event: K, listener: (data: VanguardEvents[K]) => void): this {
    return super.on(event as string, listener);
  }

  once<K extends keyof VanguardEvents>(event: K, listener: (data: VanguardEvents[K]) => void): this {
    return super.once(event as string, listener);
  }

  off<K extends keyof VanguardEvents>(event: K, listener: (data: VanguardEvents[K]) => void): this {
    return super.off(event as string, listener);
  }
}

export const events = new TypedEventEmitter();
events.setMaxListeners(50);

export default events;
