import { logger } from "../lib/logger";

type DailyAnalyticsReport = {
  date: string;
  newUsers: number;
  newListings: number;
  completedEscrows: number;
  totalEscrowVolume: string;
  activeDisputes: number;
  resolvedDisputes: number;
  fraudAlertsGenerated: number;
  trustScoreChanges: number;
  newVerifications: number;
  topCategories: string[];
  generatedAt: string;
};

let lastReport: DailyAnalyticsReport | null = null;

export async function runDailyAnalytics(): Promise<DailyAnalyticsReport> {
  const today = new Date().toISOString().split("T")[0];
  logger.info({ date: today }, "[ANALYTICS] Running daily analytics job");

  try {
    const report: DailyAnalyticsReport = {
      date: today,
      newUsers: 0,
      newListings: 0,
      completedEscrows: 0,
      totalEscrowVolume: "0",
      activeDisputes: 0,
      resolvedDisputes: 0,
      fraudAlertsGenerated: 0,
      trustScoreChanges: 0,
      newVerifications: 0,
      topCategories: [],
      generatedAt: new Date().toISOString(),
    };

    if (process.env.DATABASE_URL) {
      try {
        const { db } = await import("@workspace/db");
        const {
          usersTable,
          listingsTable,
          escrowsTable,
          disputesTable,
          verificationRequestsTable,
        } = await import("@workspace/db");

        const { count, gte, sql } = await import("drizzle-orm");

        const startOfDay = new Date(today);
        const endOfDay = new Date(startOfDay.getTime() + 86400000);

        const [[users], [listings], [escrows], [activeDisputes], [resolvedDisputes], [verifications]] =
          await Promise.all([
            db.select({ count: count() }).from(usersTable).where(gte(usersTable.createdAt, startOfDay)),
            db.select({ count: count() }).from(listingsTable).where(gte(listingsTable.createdAt, startOfDay)),
            db.select({ count: count() }).from(escrowsTable).where(gte(escrowsTable.createdAt, startOfDay)),
            db.select({ count: count() }).from(disputesTable).where(sql`status = 'open'`),
            db.select({ count: count() }).from(disputesTable).where(sql`status = 'resolved' AND updated_at >= ${startOfDay}`),
            db.select({ count: count() }).from(verificationRequestsTable).where(gte(verificationRequestsTable.createdAt, startOfDay)),
          ]);

        report.newUsers = users?.count ?? 0;
        report.newListings = listings?.count ?? 0;
        report.completedEscrows = escrows?.count ?? 0;
        report.activeDisputes = activeDisputes?.count ?? 0;
        report.resolvedDisputes = resolvedDisputes?.count ?? 0;
        report.newVerifications = verifications?.count ?? 0;
      } catch (dbErr) {
        logger.warn({ err: dbErr }, "[ANALYTICS] DB queries failed, using zeros");
      }
    }

    lastReport = report;
    logger.info({ date: today, newUsers: report.newUsers, newListings: report.newListings }, "[ANALYTICS] Daily analytics complete");
    return report;
  } catch (error) {
    logger.error({ error }, "[ANALYTICS] Daily analytics job failed");
    throw error;
  }
}

export function getLastReport(): DailyAnalyticsReport | null {
  return lastReport;
}

export function scheduleDailyAnalytics(): NodeJS.Timeout {
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);
  const delay = nextMidnight.getTime() - now.getTime();

  logger.info({ nextRunMs: delay }, "[ANALYTICS] Daily analytics scheduled");

  return setTimeout(() => {
    runDailyAnalytics().catch(logger.error);
    setInterval(() => runDailyAnalytics().catch(logger.error), 24 * 60 * 60 * 1000);
  }, delay);
}
