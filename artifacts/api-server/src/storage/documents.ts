import { generateFilename } from "./upload";
import { logger } from "../lib/logger";

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
  userId: number
): Promise<DocumentMetadata> {
  const filename = `${type}/${userId}/${generateFilename(originalName)}`;
  logger.info({ filename, type, userId }, "Document stored (stub — wire to S3/Cloudinary in production)");

  return {
    filename,
    originalName,
    mimetype: "application/pdf",
    size: buffer.length,
    uploadedAt: new Date(),
    url: `/documents/${filename}`,
  };
}

export function getDocumentUrl(filename: string): string {
  const base = process.env.STORAGE_BASE_URL ?? "/uploads";
  return `${base}/${filename}`;
}
