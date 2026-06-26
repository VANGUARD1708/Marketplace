import { apiFetch } from "@/lib/api";

export interface Wallet {
  id: number;
  userId: number;
  availableBalance: string;
  pendingBalance: string;
  escrowBalance: string;
  currency: string;
}

export interface Transaction {
  id: number;
  type: string;
  amount: string;
  fee: string;
  reference: string;
  status: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface Escrow {
  id: number;
  buyerId: number;
  sellerId: number;
  amount: string;
  fee: string;
  status: string;
  autoReleaseAt?: string;
  createdAt: string;
}

export const walletApi = {
  get: () => apiFetch<Wallet>("/wallet"),

  transactions: (page = 1) =>
    apiFetch<{ items: Transaction[]; total: number }>(`/wallet/transactions?page=${page}`),

  deposit: (data: { amount: number; provider: string; callbackUrl?: string }) =>
    apiFetch<{ authorizationUrl: string; reference: string }>("/wallet/deposit", {
      method: "POST", body: JSON.stringify(data),
    }),

  withdraw: (data: { amount: number; bankCode: string; accountNumber: string; accountName: string }) =>
    apiFetch<{ success: boolean; reference: string }>("/wallet/withdraw", {
      method: "POST", body: JSON.stringify(data),
    }),

  escrows: () => apiFetch<Escrow[]>("/escrow"),

  createEscrow: (data: { sellerId: number; amount: number; listingId?: number; description: string }) =>
    apiFetch<Escrow>("/escrow", { method: "POST", body: JSON.stringify(data) }),

  releaseEscrow: (id: number) =>
    apiFetch<{ success: boolean }>(`/escrow/${id}/release`, { method: "POST" }),

  refundEscrow: (id: number) =>
    apiFetch<{ success: boolean }>(`/escrow/${id}/refund`, { method: "POST" }),

  disputeEscrow: (id: number, data: { reason: string; description: string }) =>
    apiFetch<Escrow>(`/escrow/${id}/dispute`, { method: "POST", body: JSON.stringify(data) }),
};
