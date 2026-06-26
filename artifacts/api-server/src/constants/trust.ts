export const TRUST = {
  MIN_SCORE: 0,
  MAX_SCORE: 100,

  LEVELS: {
    RISKY: { min: 0, max: 39, label: "Risky", color: "#ef4444" },
    MODERATE: { min: 40, max: 59, label: "Moderate", color: "#f59e0b" },
    TRUSTED: { min: 60, max: 79, label: "Trusted", color: "#3b82f6" },
    ELITE: { min: 80, max: 100, label: "Elite Seller", color: "#10b981" },
  },

  WEIGHTS: {
    ID_VERIFIED: 20,
    COMPANY_VERIFIED: 15,
    EMAIL_VERIFIED: 5,
    PHONE_VERIFIED: 5,
    ESCROW_COMPLETED: 2,
    POSITIVE_REVIEW: 1,
    DISPUTE_RAISED: -8,
    DISPUTE_LOST: -15,
    FRAUD_FLAG: -40,
  },

  MAX_ESCROW_BONUS: 40,
  MAX_REVIEW_BONUS: 20,
  NEW_USER_DAYS: 30,

  BADGE_TYPES: {
    VERIFIED_USER: "verified_user",
    TRUSTED_SELLER: "trusted_seller",
    VERIFIED_COMPANY: "verified_company",
    TOP_RATED: "top_rated",
    GUARDIAN_PROTECTED: "guardian_protected",
  },
} as const;

export function getTrustLevel(score: number) {
  if (score >= 80) return TRUST.LEVELS.ELITE;
  if (score >= 60) return TRUST.LEVELS.TRUSTED;
  if (score >= 40) return TRUST.LEVELS.MODERATE;
  return TRUST.LEVELS.RISKY;
}
