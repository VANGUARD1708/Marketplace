import { generateFilename } from "./upload";
import { logger } from "../lib/logger";

export interface ImageVariant {
  width: number;
  height: number;
  quality: number;
  suffix: string;
}

export const IMAGE_VARIANTS: Record<string, ImageVariant> = {
  thumbnail: { width: 100, height: 100, quality: 70, suffix: "_thumb" },
  small: { width: 300, height: 300, quality: 80, suffix: "_sm" },
  medium: { width: 600, height: 600, quality: 85, suffix: "_md" },
  large: { width: 1200, height: 1200, quality: 90, suffix: "_lg" },
};

export interface ProcessedImage {
  original: string;
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
}

export async function processImage(buffer: Buffer, originalName: string): Promise<ProcessedImage> {
  const filename = generateFilename(originalName);
  logger.debug({ filename, size: buffer.length }, "Processing image (stub — wire to Cloudinary/Sharp in production)");
  return { original: filename };
}

export function getImageUrl(filename: string, variant?: keyof typeof IMAGE_VARIANTS): string {
  const base = process.env.STORAGE_BASE_URL ?? "/uploads";
  if (!variant) return `${base}/${filename}`;
  const v = IMAGE_VARIANTS[variant];
  const ext = filename.split(".").pop();
  const name = filename.replace(`.${ext}`, "");
  return `${base}/${name}${v.suffix}.${ext}`;
}

export function isValidImageUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(u.pathname);
  } catch {
    return false;
  }
}
