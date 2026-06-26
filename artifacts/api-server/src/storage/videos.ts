import { generateFilename } from "./upload";
import { logger } from "../lib/logger";

export interface VideoMetadata {
  filename: string;
  originalName: string;
  size: number;
  duration?: number;
  thumbnailUrl?: string;
  url: string;
}

export async function storeVideo(buffer: Buffer, originalName: string): Promise<VideoMetadata> {
  const filename = generateFilename(originalName);
  logger.info({ filename, size: buffer.length }, "Video stored (stub — wire to Cloudinary/S3 in production)");

  return {
    filename,
    originalName,
    size: buffer.length,
    url: `/videos/${filename}`,
  };
}

export function getVideoUrl(filename: string): string {
  const base = process.env.STORAGE_BASE_URL ?? "/uploads";
  return `${base}/videos/${filename}`;
}

export function getThumbnailUrl(filename: string): string {
  const base = process.env.STORAGE_BASE_URL ?? "/uploads";
  const name = filename.replace(/\.[^.]+$/, "");
  return `${base}/videos/${name}_thumb.jpg`;
}
