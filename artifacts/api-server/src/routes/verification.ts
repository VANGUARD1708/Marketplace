import { Router } from "express";
import fs from "fs";
import path from "path";
import { db } from "@workspace/db";
import { verificationRequestsTable, usersTable, trustScoresTable } from "@workspace/db";
import { eq, desc, and, sql } from "drizzle-orm";
import { requireAuth, requireAdmin, type AuthRequest } from "../middlewares/auth";
import { createMulterUpload, getDocumentPath } from "../storage/documents";
import { logger } from "../lib/logger";

const router = Router();

const UPLOADS_DIR = process.env.UPLOADS_DIR ?? path.join(process.cwd(), "uploads", "documents");

const upload = createMulterUpload([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

/**
 * GET /api/verification/status
 * Returns the authenticated user's verification requests.
 */
router.get("/status", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const rows = await db.query.verificationRequestsTable.findMany({
      where: eq(verificationRequestsTable.userId, userId),
      orderBy: [desc(verificationRequestsTable.submittedAt)],
    });
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load verification status" });
  }
});

/**
 * POST /api/verification/submit
 * Submits a new verification request with document uploads.
 */
router.post(
  "/submit",
  requireAuth,
  upload.array("documents", 5),
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const { type } = req.body;

      const validTypes = ["identity", "business", "professional"];
      if (!type || !validTypes.includes(type)) {
        return res.status(400).json({ error: "Invalid verification type. Must be one of: identity, business, professional" });
      }

      const existing = await db.query.verificationRequestsTable.findFirst({
        where: and(
          eq(verificationRequestsTable.userId, userId),
          eq(verificationRequestsTable.type, type),
          sql`${verificationRequestsTable.status} != 'rejected'`,
        ),
      });

      if (existing) {
        return res.status(409).json({
          error: `A ${type} verification request is already ${existing.status}`,
        });
      }

      const files = req.files as Express.Multer.File[] | undefined;
      const documentUrls: string[] = [];

      if (files && files.length > 0) {
        for (const file of files) {
          const filename = path.basename(file.path);
          documentUrls.push(filename);
        }
      }

      const [row] = await db
        .insert(verificationRequestsTable)
        .values({
          userId,
          type,
          status: "pending",
          documentUrls,
        })
        .returning();

      logger.info({ userId, type, docCount: documentUrls.length }, "Verification request submitted");

      return res.status(201).json(row);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to submit verification request" });
    }
  },
);

/**
 * GET /api/verification/requests
 * Admin: list all verification requests.
 */
router.get("/requests", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const rows = await db.query.verificationRequestsTable.findMany({
      orderBy: [desc(verificationRequestsTable.submittedAt)],
    });

    const enriched = await Promise.all(
      rows.map(async (row) => {
        const user = await db.query.usersTable.findFirst({
          where: eq(usersTable.id, row.userId),
        });
        return { ...row, user: user ? { id: user.id, email: user.email, username: user.username } : null };
      }),
    );

    return res.json(enriched);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load verification requests" });
  }
});

/**
 * PATCH /api/verification/requests/:id
 * Admin: approve or reject a verification request.
 */
router.patch("/requests/:id", requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { status, reason } = req.body;

    if (!["approved", "rejected", "under_review"].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be: approved, rejected, or under_review" });
    }

    const existing = await db.query.verificationRequestsTable.findFirst({
      where: eq(verificationRequestsTable.id, Number(req.params.id)),
    });

    if (!existing) {
      return res.status(404).json({ error: "Verification request not found" });
    }

    const [updated] = await db
      .update(verificationRequestsTable)
      .set({
        status,
        reviewedById: req.user!.id,
        reviewNotes: reason ?? null,
        reviewedAt: new Date(),
      })
      .where(eq(verificationRequestsTable.id, Number(req.params.id)))
      .returning();

    if (status === "approved") {
      await db
        .update(trustScoresTable)
        .set({ score: sql`LEAST(score::numeric + 20, 100)::text` })
        .where(eq(trustScoresTable.userId, existing.userId));
    }

    logger.info({ requestId: req.params.id, status, reviewer: req.user!.id }, "Verification request reviewed");

    return res.json({ success: true, verification: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update verification status" });
  }
});

/**
 * GET /api/verification/requests/:id
 * Get a single verification request (admin or owner).
 */
router.get("/requests/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const row = await db.query.verificationRequestsTable.findFirst({
      where: eq(verificationRequestsTable.id, Number(req.params.id)),
    });
    if (!row) return res.status(404).json({ error: "Verification request not found" });

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, req.user!.id),
    });

    if (row.userId !== req.user!.id && !user?.isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return res.json(row);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load verification request" });
  }
});

/**
 * GET /api/verification/document/:requestId/:filename
 * Authenticated download — only owner or admin can access.
 */
router.get("/document/:requestId/:filename", requireAuth, async (req: AuthRequest, res) => {
  try {
    const row = await db.query.verificationRequestsTable.findFirst({
      where: eq(verificationRequestsTable.id, Number(req.params.requestId)),
    });

    if (!row) return res.status(404).json({ error: "Request not found" });

    const viewer = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, req.user!.id),
    });

    if (row.userId !== req.user!.id && !viewer?.isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const filename = path.basename(req.params.filename);
    const storedNames = (row.documentUrls ?? []).map((u) => path.basename(u));
    if (!storedNames.includes(filename)) {
      return res.status(403).json({ error: "Document not associated with this request" });
    }

    const filePath = path.resolve(UPLOADS_DIR, filename);
    const resolvedBase = path.resolve(UPLOADS_DIR);
    if (!filePath.startsWith(resolvedBase + path.sep) && filePath !== resolvedBase) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to serve document" });
  }
});

/**
 * GET /api/verification/summary/:userId
 * Public summary of a user's verification status (no sensitive documents, safe for profile display).
 */
router.get("/summary/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const verifications = await db.query.verificationRequestsTable.findMany({
      where: eq(verificationRequestsTable.userId, userId),
      orderBy: [desc(verificationRequestsTable.submittedAt)],
    });

    const approved = verifications.find((v) => v.status === "approved");
    const latest = verifications[0];

    return res.json({
      userId,
      isVerified: !!approved,
      verificationType: approved?.type ?? null,
      status: approved ? "approved" : (latest?.status ?? "unverified"),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load verification summary" });
  }
});

/**
 * Legacy GET / — returns current user's requests
 */
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const rows = await db.query.verificationRequestsTable.findMany({
      where: eq(verificationRequestsTable.userId, userId),
      orderBy: [desc(verificationRequestsTable.submittedAt)],
    });
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load verification requests" });
  }
});

export default router;
