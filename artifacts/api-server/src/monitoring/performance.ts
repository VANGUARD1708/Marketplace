import { logger } from "../lib/logger";

export function measureTime<T>(label: string, fn: () => T | Promise<T>): Promise<T> {
  const start = performance.now();
  const result = fn();
  if (result instanceof Promise) {
    return result.then((val) => {
      logger.debug({ label, durationMs: Math.round(performance.now() - start) }, "Performance measurement");
      return val;
    });
  }
  logger.debug({ label, durationMs: Math.round(performance.now() - start) }, "Performance measurement");
  return Promise.resolve(result);
}

export function createTimer() {
  const start = performance.now();
  return {
    elapsed: () => Math.round(performance.now() - start),
    log: (label: string) => {
      logger.debug({ label, durationMs: Math.round(performance.now() - start) }, "Timer");
    },
  };
}

const slowQueryThresholdMs = Number(process.env.SLOW_QUERY_MS ?? 500);

export function withSlowQueryWarning<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  return fn().then((result) => {
    const ms = Math.round(performance.now() - start);
    if (ms > slowQueryThresholdMs) {
      logger.warn({ label, durationMs: ms, threshold: slowQueryThresholdMs }, "Slow operation detected");
    }
    return result;
  });
}
