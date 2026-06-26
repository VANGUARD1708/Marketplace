import type { Request, Response, NextFunction } from "express";
import { APP_CONFIG } from "../config/app";
import { generateUUID } from "../utils/uuid";
import path from "path";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_DOC_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_SIZE_BYTES = APP_CONFIG.maxUploadSizeMb * 1024 * 1024;

export interface UploadedFile {
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
}

export type FileCategory = "image" | "document" | "video";

export function getAllowedTypes(category: FileCategory): string[] {
  switch (category) {
    case "image": return ALLOWED_IMAGE_TYPES;
    case "document": return ALLOWED_DOC_TYPES;
    case "video": return ALLOWED_VIDEO_TYPES;
  }
}

export function validateFile(mimetype: string, size: number, category: FileCategory): { valid: boolean; error?: string } {
  if (size > MAX_SIZE_BYTES) return { valid: false, error: `File size exceeds ${APP_CONFIG.maxUploadSizeMb}MB limit` };
  if (!getAllowedTypes(category).includes(mimetype)) {
    return { valid: false, error: `File type not allowed. Accepted: ${getAllowedTypes(category).join(", ")}` };
  }
  return { valid: true };
}

export function generateFilename(originalName: string): string {
  const ext = path.extname(originalName);
  return `${generateUUID()}${ext}`;
}

export function uploadLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const contentLength = Number(req.headers["content-length"] ?? 0);
  if (contentLength > MAX_SIZE_BYTES) {
    return res.status(413).json({ error: `Upload exceeds ${APP_CONFIG.maxUploadSizeMb}MB limit` });
  }
  return next();
}
