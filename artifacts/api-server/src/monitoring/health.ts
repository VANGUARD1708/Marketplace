import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";
import { APP_CONFIG } from "../config/app";

interface HealthCheck {
  status: "healthy" | "degraded" | "unhealthy";
  latencyMs: number;
  error?: string;
}

interface HealthReport {
  status: "healthy" | "degraded" | "unhealthy";
  version: string;
  uptime: number;
  timestamp: string;
  checks: {
    database: HealthCheck;
    memory: HealthCheck;
  };
}

async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    await db.execute(sql`SELECT 1`);
    return { status: "healthy", latencyMs: Date.now() - start };
  } catch (error) {
    return { status: "unhealthy", latencyMs: Date.now() - start, error: String(error) };
  }
}

function checkMemory(): HealthCheck {
  const mem = process.memoryUsage();
  const heapUsedMb = mem.heapUsed / 1024 / 1024;
  const heapTotalMb = mem.heapTotal / 1024 / 1024;
  const usage = heapUsedMb / heapTotalMb;
  return {
    status: usage > 0.9 ? "degraded" : "healthy",
    latencyMs: 0,
  };
}

export async function healthHandler(_req: Request, res: Response) {
  const [database, memory] = await Promise.all([checkDatabase(), Promise.resolve(checkMemory())]);
  const overallStatus = database.status === "unhealthy" ? "unhealthy"
    : database.status === "degraded" || memory.status === "degraded" ? "degraded"
    : "healthy";

  const report: HealthReport = {
    status: overallStatus,
    version: APP_CONFIG.version,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    checks: { database, memory },
  };

  return res.status(overallStatus === "unhealthy" ? 503 : 200).json(report);
}

export async function readinessHandler(_req: Request, res: Response) {
  try {
    await db.execute(sql`SELECT 1`);
    return res.status(200).json({ ready: true });
  } catch {
    return res.status(503).json({ ready: false });
  }
}

export function livenessHandler(_req: Request, res: Response) {
  return res.status(200).json({ alive: true, uptime: process.uptime() });
}
