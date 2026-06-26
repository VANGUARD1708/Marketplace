import { logger } from "./logger";

type JobStatus = "pending" | "running" | "completed" | "failed";

type Job<T = unknown> = {
  id: string;
  name: string;
  data: T;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  createdAt: number;
  runAt: number;
  completedAt?: number;
  error?: string;
};

type JobHandler<T = unknown> = (data: T) => Promise<void>;

class JobQueue {
  private jobs = new Map<string, Job>();
  private handlers = new Map<string, JobHandler>();
  private running = false;
  private timer?: ReturnType<typeof setInterval>;

  register<T>(name: string, handler: JobHandler<T>): void {
    this.handlers.set(name, handler as JobHandler);
  }

  enqueue<T>(name: string, data: T, options: { delayMs?: number; maxAttempts?: number } = {}): string {
    const id = `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    this.jobs.set(id, {
      id, name, data, status: "pending", attempts: 0,
      maxAttempts: options.maxAttempts ?? 3,
      createdAt: Date.now(),
      runAt: Date.now() + (options.delayMs ?? 0),
    });
    logger.debug({ id, name }, "[QUEUE] Job enqueued");
    return id;
  }

  getJob(id: string): Job | null {
    return this.jobs.get(id) ?? null;
  }

  getJobsByName(name: string): Job[] {
    return [...this.jobs.values()].filter((j) => j.name === name);
  }

  start(intervalMs = 1000): void {
    if (this.running) return;
    this.running = true;
    this.timer = setInterval(() => this.tick(), intervalMs);
    logger.info("[QUEUE] Job queue started");
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.running = false;
    logger.info("[QUEUE] Job queue stopped");
  }

  private async tick(): Promise<void> {
    const now = Date.now();
    const pending = [...this.jobs.values()].filter((j) => j.status === "pending" && j.runAt <= now);
    await Promise.allSettled(pending.map((job) => this.run(job)));
  }

  private async run(job: Job): Promise<void> {
    const handler = this.handlers.get(job.name);
    if (!handler) {
      job.status = "failed";
      job.error = `No handler for job "${job.name}"`;
      return;
    }
    job.status = "running";
    job.attempts++;
    try {
      await handler(job.data);
      job.status = "completed";
      job.completedAt = Date.now();
      logger.debug({ id: job.id, name: job.name }, "[QUEUE] Job completed");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error({ id: job.id, name: job.name, error: message }, "[QUEUE] Job failed");
      if (job.attempts >= job.maxAttempts) {
        job.status = "failed";
        job.error = message;
      } else {
        job.status = "pending";
        job.runAt = Date.now() + Math.pow(2, job.attempts) * 5000;
      }
    }
  }

  stats(): { pending: number; running: number; completed: number; failed: number } {
    const counts = { pending: 0, running: 0, completed: 0, failed: 0 };
    for (const job of this.jobs.values()) counts[job.status]++;
    return counts;
  }
}

export const queue = new JobQueue();
export default queue;
