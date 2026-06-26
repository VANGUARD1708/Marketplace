import crypto from "crypto";
import { hashSha256 } from "./hashing";

const PREFIX = "vng_";
const KEY_LENGTH = 32;

type ApiKey = {
  id: string;
  userId: number;
  name: string;
  keyHash: string;
  prefix: string;
  createdAt: number;
  lastUsedAt?: number;
  expiresAt?: number;
  scopes: string[];
  isActive: boolean;
};

const apiKeys = new Map<string, ApiKey>();

export function generateApiKey(): { raw: string; prefix: string; hash: string } {
  const raw = PREFIX + crypto.randomBytes(KEY_LENGTH).toString("base64url");
  const prefix = raw.slice(0, PREFIX.length + 8);
  const hash = hashSha256(raw);
  return { raw, prefix, hash };
}

export function createApiKey(userId: number, name: string, scopes: string[] = [], expiresInDays?: number): { id: string; raw: string; prefix: string } {
  const id = crypto.randomUUID();
  const { raw, prefix, hash: keyHash } = generateApiKey();
  const expiresAt = expiresInDays ? Date.now() + expiresInDays * 86400000 : undefined;
  apiKeys.set(keyHash, { id, userId, name, keyHash, prefix, createdAt: Date.now(), expiresAt, scopes, isActive: true });
  return { id, raw, prefix };
}

export function validateApiKey(rawKey: string): ApiKey | null {
  const hash = hashSha256(rawKey);
  const key = apiKeys.get(hash);
  if (!key || !key.isActive) return null;
  if (key.expiresAt && Date.now() > key.expiresAt) return null;
  key.lastUsedAt = Date.now();
  return key;
}

export function revokeApiKey(id: string): boolean {
  for (const [hash, key] of apiKeys.entries()) {
    if (key.id === id) {
      key.isActive = false;
      return true;
    }
  }
  return false;
}

export function getUserApiKeys(userId: number): Omit<ApiKey, "keyHash">[] {
  return [...apiKeys.values()]
    .filter((k) => k.userId === userId)
    .map(({ keyHash: _, ...rest }) => rest);
}

export function hasScope(key: ApiKey, scope: string): boolean {
  return key.scopes.includes("*") || key.scopes.includes(scope);
}
