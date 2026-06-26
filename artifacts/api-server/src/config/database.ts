export const DB_CONFIG = {
  url: process.env.DATABASE_URL,
  poolMin: Number(process.env.DB_POOL_MIN ?? 2),
  poolMax: Number(process.env.DB_POOL_MAX ?? 10),
  idleTimeoutMs: Number(process.env.DB_IDLE_TIMEOUT ?? 30_000),
  connectTimeoutMs: Number(process.env.DB_CONNECT_TIMEOUT ?? 10_000),
  statementTimeout: Number(process.env.DB_STATEMENT_TIMEOUT ?? 30_000),
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
} as const;

export function assertDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL environment variable is required");
  return url;
}
