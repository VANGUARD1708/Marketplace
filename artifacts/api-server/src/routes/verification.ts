import { Router } from "express";
import { db } from "@workspace/db";
import { verificationRequestsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    const rows = await db.query.verificationRequestsTable.findMany({
      where: userId ? eq(verificationRequestsTable.userId, userId) : undefined,
      orderBy: [desc(verificationRequestsTable.submittedAt)],
    });
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load verification requests" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const row = await db.query.verificationRequestsTable.findFirst({
      where: eq(verificationRequestsTable.id, Number(req.params.id)),
    });
    if (!row) return res.status(404).json({ error: "Verification request not found" });
    return res.json(row);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load verification request" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { certificateId } = req.body;
    const [row] = await db.insert(verificationRequestsTable).values({
      userId: req.user!.id,
      certificateId: certificateId ? Number(certificateId) : undefined,
      status: "pending",
    }).returning();
    return res.status(201).json(row);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to submit verification request" });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status, reviewedById, reviewNotes } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const [row] = await db.update(verificationRequestsTable)
      .set({ status, reviewedById, reviewNotes, reviewedAt: new Date() })
      .where(eq(verificationRequestsTable.id, Number(req.params.id)))
      .returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json({ success: true, verification: row });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update verification status" });
  }
});

export default router;
