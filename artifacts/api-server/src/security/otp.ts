import crypto from "crypto";

const OTP_TTL_MS = 10 * 60 * 1000;

type OtpEntry = {
  code: string;
  expiresAt: number;
  attempts: number;
  used: boolean;
};

const store = new Map<string, OtpEntry>();

export function generateOtp(digits = 6): string {
  const max = Math.pow(10, digits);
  const bytes = crypto.randomBytes(4);
  const num = bytes.readUInt32BE(0) % max;
  return num.toString().padStart(digits, "0");
}

export function createOtp(key: string, digits = 6, ttlMs = OTP_TTL_MS): string {
  const code = generateOtp(digits);
  store.set(key, { code, expiresAt: Date.now() + ttlMs, attempts: 0, used: false });
  return code;
}

export function verifyOtp(key: string, code: string, maxAttempts = 3): { valid: boolean; error?: string } {
  const entry = store.get(key);
  if (!entry) return { valid: false, error: "OTP not found or expired" };
  if (entry.used) return { valid: false, error: "OTP already used" };
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return { valid: false, error: "OTP has expired" };
  }
  if (entry.attempts >= maxAttempts) {
    store.delete(key);
    return { valid: false, error: "Too many attempts" };
  }
  entry.attempts++;
  if (entry.code !== code) {
    const remaining = maxAttempts - entry.attempts;
    return { valid: false, error: `Invalid OTP. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining` };
  }
  entry.used = true;
  store.delete(key);
  return { valid: true };
}

export function invalidateOtp(key: string): void {
  store.delete(key);
}

export function pruneExpiredOtps(): number {
  let count = 0;
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.expiresAt) { store.delete(key); count++; }
  }
  return count;
}

export function otpKey(type: "phone" | "email" | "reset" | "verify", identifier: string): string {
  return `otp:${type}:${identifier}`;
}
