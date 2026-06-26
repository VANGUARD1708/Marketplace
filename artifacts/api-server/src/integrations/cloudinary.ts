import crypto from "crypto";
import { logger } from "../lib/logger";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const BASE_URL = `https://api.cloudinary.com/v1_1`;
const CDN_BASE = `https://res.cloudinary.com`;

function isConfigured(): boolean {
  return Boolean(CLOUD_NAME && API_KEY && API_SECRET);
}

function sign(params: Record<string, string | number>): string {
  const sorted = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&");
  return crypto.createHash("sha256").update(sorted + API_SECRET).digest("hex");
}

export async function uploadImage(buffer: Buffer, options?: { folder?: string; publicId?: string }): Promise<{ url: string; publicId: string }> {
  if (!isConfigured()) {
    logger.warn("Cloudinary not configured — using placeholder");
    return { url: "/placeholder.jpg", publicId: "placeholder" };
  }

  const timestamp = Math.round(Date.now() / 1000);
  const params: Record<string, string | number> = {
    timestamp,
    folder: options?.folder ?? "vanguard",
    ...(options?.publicId ? { public_id: options.publicId } : {}),
  };
  const signature = sign(params);

  const formData = new FormData();
  formData.append("file", new Blob([buffer]));
  formData.append("api_key", API_KEY!);
  formData.append("signature", signature);
  formData.append("timestamp", String(timestamp));
  Object.entries(params).forEach(([k, v]) => formData.append(k, String(v)));

  const res = await fetch(`${BASE_URL}/${CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
  const data = await res.json() as { secure_url: string; public_id: string; error?: { message: string } };
  if (data.error) throw new Error(data.error.message);

  return { url: data.secure_url, publicId: data.public_id };
}

export async function deleteImage(publicId: string): Promise<boolean> {
  if (!isConfigured()) return false;
  const timestamp = Math.round(Date.now() / 1000);
  const signature = sign({ public_id: publicId, timestamp });
  const res = await fetch(`${BASE_URL}/${CLOUD_NAME}/image/destroy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ public_id: publicId, api_key: API_KEY, signature, timestamp }),
  });
  const data = await res.json() as { result: string };
  return data.result === "ok";
}

export function getOptimizedUrl(publicId: string, opts?: { width?: number; height?: number; quality?: number }): string {
  if (!CLOUD_NAME) return "/placeholder.jpg";
  const transforms = [
    opts?.width ? `w_${opts.width}` : "",
    opts?.height ? `h_${opts.height}` : "",
    `q_${opts?.quality ?? 80}`,
    "f_auto",
    "c_fill",
  ].filter(Boolean).join(",");
  return `${CDN_BASE}/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}
