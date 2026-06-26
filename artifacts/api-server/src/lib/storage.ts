import crypto from "crypto";
import path from "path";
import { logger } from "./logger";

type UploadResult = { success: boolean; url?: string; key?: string; error?: string };
type FileInfo = { key: string; url: string; size: number; mimeType: string; uploadedAt: number };

const STORAGE_BASE_URL = process.env.STORAGE_BASE_URL ?? "https://storage.vanguard.ng";
const BUCKET = process.env.STORAGE_BUCKET ?? "vanguard-assets";
const files = new Map<string, FileInfo>();

function generateKey(folder: string, filename: string): string {
  const ext = path.extname(filename);
  const hash = crypto.randomBytes(8).toString("hex");
  const timestamp = Date.now();
  return `${folder}/${timestamp}-${hash}${ext}`;
}

function publicUrl(key: string): string {
  return `${STORAGE_BASE_URL}/${BUCKET}/${key}`;
}

export const storage = {
  async upload(buffer: Buffer, filename: string, folder: string, mimeType: string): Promise<UploadResult> {
    const key = generateKey(folder, filename);

    if (process.env.NODE_ENV !== "production") {
      const url = publicUrl(key);
      files.set(key, { key, url, size: buffer.length, mimeType, uploadedAt: Date.now() });
      logger.info({ key, size: buffer.length }, "[STORAGE] File stored (dev mode — in memory)");
      return { success: true, url, key };
    }

    logger.warn("[STORAGE] Object storage provider not configured");
    return { success: false, error: "Storage provider not configured" };
  },

  async uploadFromBase64(base64: string, filename: string, folder: string, mimeType: string): Promise<UploadResult> {
    const buffer = Buffer.from(base64.replace(/^data:[^;]+;base64,/, ""), "base64");
    return this.upload(buffer, filename, folder, mimeType);
  },

  async delete(key: string): Promise<boolean> {
    if (process.env.NODE_ENV !== "production") {
      files.delete(key);
      return true;
    }
    logger.warn({ key }, "[STORAGE] Delete not implemented");
    return false;
  },

  getUrl(key: string): string {
    return publicUrl(key);
  },

  async getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const expiry = Date.now() + expiresInSeconds * 1000;
    const sig = crypto.createHmac("sha256", process.env.STORAGE_SECRET ?? "dev").update(`${key}:${expiry}`).digest("hex").slice(0, 16);
    return `${publicUrl(key)}?expires=${expiry}&sig=${sig}`;
  },

  folders: {
    avatars: "avatars",
    listings: "listings",
    documents: "documents",
    courses: "courses",
    services: "services",
    companies: "companies",
  },
};

export default storage;
