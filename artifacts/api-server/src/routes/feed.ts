import { Router } from "express";
import { db } from "@workspace/db";
import { postsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const offset = Number(req.query.offset) || 0;
    const posts = await db.query.postsTable.findMany({
      orderBy: [desc(postsTable.createdAt)],
      limit,
      offset,
    });
    return res.json({ posts, limit, offset });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load feed" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { content, mediaUrl } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: "content required" });
    const [post] = await db.insert(postsTable).values({
      userId: req.user!.id,
      content: content.trim(),
      mediaUrl,
    }).returning();
    return res.status(201).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create post" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await db.query.postsTable.findFirst({
      where: eq(postsTable.id, Number(req.params.id)),
    });
    if (!post) return res.status(404).json({ error: "Post not found" });
    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load post" });
  }
});

router.patch("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const post = await db.query.postsTable.findFirst({ where: eq(postsTable.id, Number(req.params.id)) });
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.userId !== req.user!.id) return res.status(403).json({ error: "Forbidden" });
    const [updated] = await db.update(postsTable)
      .set({ content: req.body.content, mediaUrl: req.body.mediaUrl, updatedAt: new Date() })
      .where(eq(postsTable.id, post.id)).returning();
    return res.json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update post" });
  }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const post = await db.query.postsTable.findFirst({ where: eq(postsTable.id, Number(req.params.id)) });
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.userId !== req.user!.id) return res.status(403).json({ error: "Forbidden" });
    await db.delete(postsTable).where(eq(postsTable.id, post.id));
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;
