export const NAIRA_SYMBOL = "₦";
export const DEFAULT_CURRENCY = "NGN";

export function toKobo(naira: number): number {
  return Math.round(naira * 100);
}

export function fromKobo(kobo: number): number {
  return kobo / 100;
}

export function formatAmount(amount: number | string, symbol = NAIRA_SYMBOL): string {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return `${symbol}${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function calculateFee(amount: number, rate: number): number {
  return Math.round(amount * rate * 100) / 100;
}

export function applyFee(amount: number, rate: number): { net: number; fee: number; total: number } {
  const fee = calculateFee(amount, rate);
  return { net: amount - fee, fee, total: amount };
}

export function clamp(amount: number, min: number, max: number): number {
  return Math.min(Math.max(amount, min), max);
}

export function isValidAmount(amount: unknown): amount is number {
  return typeof amount === "number" && isFinite(amount) && amount > 0;
}

export function parseAmount(value: string | number): number {
  if (typeof value === "number") return value;
  return parseFloat(value.replace(/[^0-9.]/g, ""));
}
