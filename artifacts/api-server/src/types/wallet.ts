export interface Wallet {
  id: number;
  userId: number;
  availableBalance: string;
  pendingBalance: string;
  escrowBalance: string;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: number;
  walletId: number;
  type: string;
  amount: string;
  fee: string;
  reference: string;
  status: "pending" | "completed" | "failed" | "reversed";
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface Escrow {
  id: number;
  buyerId: number;
  sellerId: number;
  listingId?: number;
  amount: string;
  fee: string;
  status: string;
  releaseCondition: string;
  autoReleaseAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DepositRequest {
  amount: number;
  provider: "paystack" | "flutterwave" | "stripe";
  callbackUrl?: string;
}

export interface WithdrawalRequest {
  amount: number;
  bankCode: string;
  accountNumber: string;
  accountName: string;
}
