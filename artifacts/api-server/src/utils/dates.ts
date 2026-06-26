export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function daysBetween(a: Date, b: Date): number {
  return Math.abs(Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)));
}

export function isExpired(date: Date): boolean {
  return new Date() > date;
}

export function autoReleaseDate(days = 14): Date {
  return addDays(new Date(), days);
}

export function formatDate(date: Date | string, locale = "en-NG"): string {
  return new Date(date).toLocaleDateString(locale, {
    day: "numeric", month: "short", year: "numeric",
  });
}

export function formatDateTime(date: Date | string, locale = "en-NG"): string {
  return new Date(date).toLocaleString(locale, {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function timeAgo(date: Date | string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(date);
}

export function toISO(date: Date): string {
  return date.toISOString();
}

export function startOfDay(date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date = new Date()): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}
