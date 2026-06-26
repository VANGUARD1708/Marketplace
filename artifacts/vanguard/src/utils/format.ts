import { APP } from "@/constants/app";

export function formatCurrency(amount: number | string, symbol = APP.CURRENCY_SYMBOL): string {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(n)) return `${symbol}0.00`;
  return `${symbol}${n.toLocaleString(APP.LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString(APP.LOCALE, { day: "numeric", month: "short", year: "numeric" });
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString(APP.LOCALE, { hour: "2-digit", minute: "2-digit" });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString(APP.LOCALE, {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(date);
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}…`;
}

export function formatUsername(username: string): string {
  return username.startsWith("@") ? username : `@${username}`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return `${count} ${count === 1 ? singular : (plural ?? `${singular}s`)}`;
}

export function trustLevelColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-blue-600";
  if (score >= 40) return "text-amber-600";
  return "text-red-600";
}

export function trustLevelLabel(score: number): string {
  if (score >= 80) return "Elite Seller";
  if (score >= 60) return "Trusted";
  if (score >= 40) return "Moderate";
  return "Risky";
}
