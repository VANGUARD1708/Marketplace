import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

interface RequestMetric {
  path: string;
  method: string;
  statusCode: number;
  durationMs: number;
  timestamp: number;
}

const metrics: {
  requests: RequestMetric[];
  errors: number;
  startTime: number;
} = {
  requests: [],
  errors: 0,
  startTime: Date.now(),
};

const MAX_METRICS_STORED = 1000;

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const metric: RequestMetric = {
      path: req.path,
      method: req.method,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
      timestamp: start,
    };

    metrics.requests.push(metric);
    if (metrics.requests.length > MAX_METRICS_STORED) {
      metrics.requests.shift();
    }
    if (res.statusCode >= 500) metrics.errors++;
  });

  next();
}

export function getMetrics() {
  const now = Date.now();
  const last1m = metrics.requests.filter((r) => r.timestamp > now - 60_000);
  const last5m = metrics.requests.filter((r) => r.timestamp > now - 300_000);

  const avgLatency = (reqs: RequestMetric[]) =>
    reqs.length ? Math.round(reqs.reduce((s, r) => s + r.durationMs, 0) / reqs.length) : 0;

  return {
    uptime: Math.round((now - metrics.startTime) / 1000),
    totalRequests: metrics.requests.length,
    totalErrors: metrics.errors,
    last1m: {
      requests: last1m.length,
      avgLatencyMs: avgLatency(last1m),
      errorRate: last1m.length ? last1m.filter((r) => r.statusCode >= 500).length / last1m.length : 0,
    },
    last5m: {
      requests: last5m.length,
      avgLatencyMs: avgLatency(last5m),
    },
    memory: process.memoryUsage(),
    pid: process.pid,
  };
}

export function metricsHandler(_req: Request, res: Response) {
  return res.json(getMetrics());
}
