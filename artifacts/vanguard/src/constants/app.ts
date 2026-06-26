export const APP = {
  NAME: "Vanguard",
  TAGLINE: "Trade with confidence. Verified. Protected.",
  DESCRIPTION: "Nigeria's most trusted marketplace and community",
  VERSION: "1.0.0",
  CURRENCY: "NGN",
  CURRENCY_SYMBOL: "₦",
  LOCALE: "en-NG",

  SUPPORT_EMAIL: "support@vanguard.ng",
  TWITTER: "@VanguardNG",

  TRUST_LEVELS: {
    RISKY: { label: "Risky", color: "#ef4444", bg: "bg-red-100 text-red-700" },
    MODERATE: { label: "Moderate", color: "#f59e0b", bg: "bg-amber-100 text-amber-700" },
    TRUSTED: { label: "Trusted", color: "#3b82f6", bg: "bg-blue-100 text-blue-700" },
    ELITE: { label: "Elite Seller", color: "#10b981", bg: "bg-emerald-100 text-emerald-700" },
  },

  LISTING_CATEGORIES: [
    "Electronics",
    "Fashion",
    "Vehicles",
    "Home & Garden",
    "Services",
    "Food & Drinks",
    "Jobs",
    "Courses",
    "Other",
  ],

  LISTING_CONDITIONS: [
    { value: "new", label: "Brand New" },
    { value: "like_new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" },
  ],

  ESCROW_RELEASE_DAYS: 14,
  MIN_DEPOSIT: 100,
  MAX_DEPOSIT: 5_000_000,
  MIN_WITHDRAWAL: 500,
  PLATFORM_FEE_PERCENT: 5,
  ESCROW_FEE_PERCENT: 1.5,

  PAGINATION_SIZE: 20,
} as const;
