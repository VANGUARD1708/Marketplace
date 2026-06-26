import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET =
  process.env.JWT_SECRET ??
  "CHANGE_THIS_IN_PRODUCTION";

const REFRESH_SECRET =
  process.env.REFRESH_SECRET ??
  "REFRESH_CHANGE_THIS_IN_PRODUCTION";

export async function hashPassword(
  password: string,
) {
  return argon2.hash(password);
}

export async function verifyPassword(
  hash: string,
  password: string,
) {
  return argon2.verify(hash, password);
}

export function createAccessToken(userId: number) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: number };
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString("hex");
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getRefreshTokenExpiry(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d;
}
