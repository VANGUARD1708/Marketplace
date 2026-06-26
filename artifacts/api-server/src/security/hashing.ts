import argon2 from "argon2";
import crypto from "crypto";

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

export function hashSha256(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

export function hashMd5(data: string): string {
  return crypto.createHash("md5").update(data).digest("hex");
}

export function hmac(data: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

export function verifyHmac(data: string, secret: string, expected: string): boolean {
  const computed = hmac(data, secret);
  return crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(expected, "hex"));
}

export function generateSalt(length = 32): string {
  return crypto.randomBytes(length).toString("hex");
}
