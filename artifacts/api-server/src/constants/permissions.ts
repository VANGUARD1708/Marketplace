export const PERMISSIONS = {
  LISTING_CREATE: "listing:create",
  LISTING_EDIT: "listing:edit",
  LISTING_DELETE: "listing:delete",
  LISTING_VIEW: "listing:view",
  LISTING_FEATURE: "listing:feature",

  USER_VIEW: "user:view",
  USER_EDIT: "user:edit",
  USER_BAN: "user:ban",
  USER_VERIFY: "user:verify",

  WALLET_VIEW: "wallet:view",
  WALLET_DEPOSIT: "wallet:deposit",
  WALLET_WITHDRAW: "wallet:withdraw",
  WALLET_TRANSFER: "wallet:transfer",

  ESCROW_CREATE: "escrow:create",
  ESCROW_RELEASE: "escrow:release",
  ESCROW_REFUND: "escrow:refund",
  ESCROW_DISPUTE: "escrow:dispute",

  REVIEW_CREATE: "review:create",
  REVIEW_DELETE: "review:delete",

  DISPUTE_CREATE: "dispute:create",
  DISPUTE_RESOLVE: "dispute:resolve",

  ADMIN_ACCESS: "admin:access",
  ADMIN_REPORTS: "admin:reports",
  ADMIN_ANALYTICS: "admin:analytics",
  ADMIN_IMPERSONATE: "admin:impersonate",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
