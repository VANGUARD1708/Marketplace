export const APP_CONFIG = {
  name: "Vanguard",
  version: "1.0.0",
  description: "Trusted marketplace and community platform",
  supportEmail: "support@vanguard.ng",
  baseUrl: process.env.APP_URL ?? "https://vanguard.ng",

  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV !== "production",

  corsOrigins: (process.env.CORS_ORIGINS ?? "*").split(","),
  maxUploadSizeMb: Number(process.env.MAX_UPLOAD_MB ?? 10),

  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },

  rateLimits: {
    global: { windowMs: 15 * 60 * 1000, max: 500 },
    auth: { windowMs: 15 * 60 * 1000, max: 10 },
    upload: { windowMs: 60 * 1000, max: 5 },
  },
} as const;
