import { logger } from "../lib/logger";

export interface TelemetryEvent {
  name: string;
  properties?: Record<string, unknown>;
  userId?: number;
  timestamp?: Date;
}

const queue: TelemetryEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

export function track(event: TelemetryEvent) {
  queue.push({ ...event, timestamp: event.timestamp ?? new Date() });
  scheduleFlush();
}

export function trackUserAction(userId: number, action: string, properties?: Record<string, unknown>) {
  track({ name: action, userId, properties });
}

export function trackError(name: string, error: unknown, properties?: Record<string, unknown>) {
  track({
    name: `error.${name}`,
    properties: { ...properties, error: String(error), stack: error instanceof Error ? error.stack : undefined },
  });
}

function scheduleFlush() {
  if (!flushTimer) {
    flushTimer = setTimeout(flush, 5000);
  }
}

function flush() {
  if (queue.length === 0) return;
  const events = queue.splice(0, queue.length);
  logger.info({ eventCount: events.length, events: events.map((e) => e.name) }, "[telemetry] flushed");
  flushTimer = null;
}

process.on("beforeExit", flush);
