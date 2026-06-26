export const ESCROW = {
  STATUS: {
    PENDING: "pending",
    FUNDED: "funded",
    RELEASED: "released",
    REFUNDED: "refunded",
    DISPUTED: "disputed",
    CANCELLED: "cancelled",
    EXPIRED: "expired",
  },

  AUTO_RELEASE_DAYS: 14,
  DISPUTE_WINDOW_DAYS: 3,
  RESOLUTION_DAYS: 7,
  MAX_EXTENSION_DAYS: 7,

  DISPUTE_REASONS: [
    "item_not_received",
    "item_not_as_described",
    "item_damaged",
    "seller_unresponsive",
    "fraud",
    "other",
  ],

  RELEASE_CONDITIONS: {
    BUYER_CONFIRMED: "buyer_confirmed",
    AUTO_RELEASED: "auto_released",
    ADMIN_RELEASED: "admin_released",
  },
} as const;
