import { Router } from "express";
import { db } from "@workspace/db";
import { suggestionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth";

const router = Router();

router.get("/suggestions", async (_req, res) => {
  try {
    const suggestions = await db.query.suggestionsTable.findMany({
      orderBy: [desc(suggestionsTable.createdAt)],
    });
    return res.json(suggestions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load suggestions" });
  }
});

router.post("/suggestions", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) return res.status(400).json({ error: "title and body required" });
    const [suggestion] = await db.insert(suggestionsTable).values({
      userId: req.user!.id,
      title,
      body,
      status: "pending",
    }).returning();
    return res.status(201).json(suggestion);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create suggestion" });
  }
});

router.get("/suggestions/:id", async (req, res) => {
  try {
    const suggestion = await db.query.suggestionsTable.findFirst({
      where: eq(suggestionsTable.id, Number(req.params.id)),
    });
    if (!suggestion) return res.status(404).json({ error: "Suggestion not found" });
    return res.json(suggestion);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load suggestion" });
  }
});

router.patch("/suggestions/:id/review", async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const [suggestion] = await db.update(suggestionsTable)
      .set({ status, adminNotes, reviewedAt: new Date() })
      .where(eq(suggestionsTable.id, Number(req.params.id)))
      .returning();
    if (!suggestion) return res.status(404).json({ error: "Not found" });
    return res.json({ success: true, suggestion });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to review suggestion" });
  }
});

router.get("/decisions", async (_req, res) => {
  try {
    const decided = await db.query.suggestionsTable.findMany({
      where: eq(suggestionsTable.status, "accepted"),
      orderBy: [desc(suggestionsTable.reviewedAt)],
    });
    return res.json(decided);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load decisions" });
  }
});

export default router;
