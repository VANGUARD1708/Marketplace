import fs from "fs";
import path from "path";
import multer from "multer";
import { generateFilename } from "./upload";
import { logger } from "../lib/logger";

const UPLOADS_DIR = process.env.UPLOADS_DIR ?? path.join(process.cwd(), "uploads", "documents");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export interface DocumentMetadata {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  uploadedAt: Date;
  url: string;
}

export type DocumentType = "certificate" | "id_document" | "contract" | "receipt" | "other";

export async function storeDocument(
  buffer: Buffer,
  originalName: string,
  type: DocumentType,
  userId: number,
  mimetype = "application/octet-stream",
): Promise<DocumentMetadata> {
  const subDir = path.join(UPLOADS_DIR, type, String(userId));
  ensureDir(subDir);

  const filename = generateFilename(originalName);
  const filePath = path.join(subDir, filename);

  await fs.promises.writeFile(filePath, buffer);

  const relPath = path.join(type, String(userId), filename);
  const url = `/api/uploads/documents/${relPath}`;

  logger.info({ filePath, type, userId }, "Document stored to disk");

  return {
    filename: relPath,
    originalName,
    mimetype,
    size: buffer.length,
    uploadedAt: new Date(),
    url,
  };
}

export function getDocumentUrl(filename: string): string {
  return `/api/uploads/documents/${filename}`;
}

export function getDocumentPath(filename: string): string {
  return path.join(UPLOADS_DIR, filename);
}

export function createMulterUpload(allowedMimetypes?: string[]) {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      ensureDir(UPLOADS_DIR);
      cb(null, UPLOADS_DIR);
    },
    filename: (_req, file, cb) => {
      cb(null, generateFilename(file.originalname));
    },
  });

  return multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (!allowedMimetypes || allowedMimetypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`File type not allowed: ${file.mimetype}`));
      }
    },
  });
}
