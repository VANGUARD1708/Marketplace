export const WALLET = {
  CURRENCY: "NGN",
  CURRENCY_SYMBOL: "₦",

  MIN_DEPOSIT: 100,
  MAX_DEPOSIT: 5_000_000,
  MIN_WITHDRAWAL: 500,
  MAX_WITHDRAWAL_DAILY: 1_000_000,

  PLATFORM_FEE_RATE: 0.05,
  ESCROW_FEE_RATE: 0.015,
  WITHDRAWAL_FEE: 50,

  TRANSACTION_TYPES: {
    DEPOSIT: "deposit",
    WITHDRAWAL: "withdrawal",
    TRANSFER: "transfer",
    ESCROW_FUND: "escrow_fund",
    ESCROW_RELEASE: "escrow_release",
    ESCROW_REFUND: "escrow_refund",
    PLATFORM_FEE: "platform_fee",
    REFUND: "refund",
  },

  TRANSACTION_STATUS: {
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed",
    REVERSED: "reversed",
  },
} as const;
