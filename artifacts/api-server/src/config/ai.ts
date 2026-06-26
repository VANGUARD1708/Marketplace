export const AI_CONFIG = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? "",
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    maxTokens: Number(process.env.OPENAI_MAX_TOKENS ?? 1000),
    temperature: Number(process.env.OPENAI_TEMPERATURE ?? 0.3),
    baseUrl: process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
  },

  guardian: {
    blockThreshold: Number(process.env.GUARDIAN_BLOCK_THRESHOLD ?? 70),
    reviewThreshold: Number(process.env.GUARDIAN_REVIEW_THRESHOLD ?? 40),
    autoBlockFraud: process.env.GUARDIAN_AUTO_BLOCK_FRAUD !== "false",
    enableContentModeration: process.env.GUARDIAN_CONTENT_MOD !== "false",
  },

  trustScore: {
    recalculateIntervalHours: Number(process.env.TRUST_RECALC_HOURS ?? 24),
    cacheExpiryMinutes: Number(process.env.TRUST_CACHE_MINS ?? 60),
  },
} as const;
