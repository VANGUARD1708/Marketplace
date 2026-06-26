import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32;
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

function getKey(): Buffer {
  const secret = process.env.ENCRYPTION_KEY ?? "default-encryption-key-change-me!";
  return crypto.createHash("sha256").update(secret).digest();
}

export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv) as crypto.CipherGCM;
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decrypt(ciphertext: string): string {
  const key = getKey();
  const data = Buffer.from(ciphertext, "base64");
  const iv = data.subarray(0, IV_LENGTH);
  const tag = data.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const encrypted = data.subarray(IV_LENGTH + TAG_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv) as crypto.DecipherGCM;
  decipher.setAuthTag(tag);
  return decipher.update(encrypted) + decipher.final("utf8");
}

export function encryptObject<T>(obj: T): string {
  return encrypt(JSON.stringify(obj));
}

export function decryptObject<T>(ciphertext: string): T {
  return JSON.parse(decrypt(ciphertext)) as T;
}

export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

export function generateSecureCode(digits = 6): string {
  const max = Math.pow(10, digits);
  const bytes = crypto.randomBytes(4);
  const num = bytes.readUInt32BE(0) % max;
  return num.toString().padStart(digits, "0");
}
