import { Router } from "express";
import { db } from "@workspace/db";
import {
  postsTable,
  followersTable,
  communityMembersTable,
  postLikesTable,
  postCommentsTable,
  profilesTable,
  usersTable,
  communitiesTable,
} from "@workspace/db";
import { desc, eq, and, inArray, or, sql } from "drizzle-orm";
import { requireAuth, optionalAuth, type AuthRequest } from "../middlewares/auth";

const router = Router();

router.get("/", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const offset = Number(req.query.offset) || 0;

    let posts;

    if (userId) {
      const following = await db
        .select({ followingId: followersTable.followingId })
        .from(followersTable)
        .where(eq(followersTable.followerId, userId));

      const joinedCommunities = await db
        .select({ communityId: communityMembersTable.communityId })
        .from(communityMembersTable)
        .where(eq(communityMembersTable.userId, userId));

      const followingIds = following.map((f) => f.followingId);
      const communityIds = joinedCommunities.map((c) => c.communityId);

      const conditions = [];
      if (followingIds.length > 0) conditions.push(inArray(postsTable.userId, [...followingIds, userId]));
      else conditions.push(eq(postsTable.userId, userId));
      if (communityIds.length > 0) conditions.push(inArray(postsTable.communityId, communityIds));

      posts = await db
        .select({
          id: postsTable.id,
          userId: postsTable.userId,
          communityId: postsTable.communityId,
          content: postsTable.content,
          mediaUrl: postsTable.mediaUrl,
          likesCount: postsTable.likesCount,
          createdAt: postsTable.createdAt,
          authorName: profilesTable.displayName,
          authorAvatar: profilesTable.avatarUrl,
          authorUsername: usersTable.username,
        })
        .from(postsTable)
        .leftJoin(profilesTable, eq(profilesTable.userId, postsTable.userId))
        .leftJoin(usersTable, eq(usersTable.id, postsTable.userId))
        .where(or(...conditions))
        .orderBy(desc(postsTable.createdAt))
        .limit(limit)
        .offset(offset);

      const likedPostIds = await db
        .select({ postId: postLikesTable.postId })
        .from(postLikesTable)
        .where(eq(postLikesTable.userId, userId));
      const likedSet = new Set(likedPostIds.map((l) => l.postId));

      return res.json({
        posts: posts.map((p) => ({ ...p, isLiked: likedSet.has(p.id) })),
        limit,
        offset,
      });
    }

    posts = await db
      .select({
        id: postsTable.id,
        userId: postsTable.userId,
        communityId: postsTable.communityId,
        content: postsTable.content,
        mediaUrl: postsTable.mediaUrl,
        likesCount: postsTable.likesCount,
        createdAt: postsTable.createdAt,
        authorName: profilesTable.displayName,
        authorAvatar: profilesTable.avatarUrl,
        authorUsername: usersTable.username,
      })
      .from(postsTable)
      .leftJoin(profilesTable, eq(profilesTable.userId, postsTable.userId))
      .leftJoin(usersTable, eq(usersTable.id, postsTable.userId))
      .orderBy(desc(postsTable.createdAt))
      .limit(limit)
      .offset(offset);

    return res.json({ posts: posts.map((p) => ({ ...p, isLiked: false })), limit, offset });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load feed" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { content, mediaUrl, communityId } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: "content required" });

    if (communityId) {
      const cid = Number(communityId);

      const community = await db.query.communitiesTable.findFirst({
        where: eq(communitiesTable.id, cid),
      });
      if (!community) return res.status(404).json({ error: "Community not found" });

      const membership = await db.query.communityMembersTable.findFirst({
        where: and(
          eq(communityMembersTable.communityId, cid),
          eq(communityMembersTable.userId, req.user!.id),
        ),
      });
      if (!membership) return res.status(403).json({ error: "You must be a member to post in this community" });
    }

    const [post] = await db
      .insert(postsTable)
      .values({
        userId: req.user!.id,
        content: content.trim(),
        mediaUrl,
        communityId: communityId ? Number(communityId) : null,
      })
      .returning();
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

router.post("/:id/like", requireAuth, async (req: AuthRequest, res) => {
  try {
    const postId = Number(req.params.id);
    const userId = req.user!.id;

    const existing = await db.query.postLikesTable.findFirst({
      where: and(eq(postLikesTable.postId, postId), eq(postLikesTable.userId, userId)),
    });

    if (existing) {
      await db.delete(postLikesTable).where(
        and(eq(postLikesTable.postId, postId), eq(postLikesTable.userId, userId)),
      );
      await db
        .update(postsTable)
        .set({ likesCount: sql`GREATEST(${postsTable.likesCount} - 1, 0)` })
        .where(eq(postsTable.id, postId));
      return res.json({ liked: false });
    }

    await db.insert(postLikesTable).values({ postId, userId });
    await db
      .update(postsTable)
      .set({ likesCount: sql`${postsTable.likesCount} + 1` })
      .where(eq(postsTable.id, postId));
    return res.json({ liked: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to toggle like" });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const comments = await db
      .select({
        id: postCommentsTable.id,
        postId: postCommentsTable.postId,
        userId: postCommentsTable.userId,
        content: postCommentsTable.content,
        createdAt: postCommentsTable.createdAt,
        authorName: profilesTable.displayName,
        authorAvatar: profilesTable.avatarUrl,
        authorUsername: usersTable.username,
      })
      .from(postCommentsTable)
      .leftJoin(profilesTable, eq(profilesTable.userId, postCommentsTable.userId))
      .leftJoin(usersTable, eq(usersTable.id, postCommentsTable.userId))
      .where(eq(postCommentsTable.postId, postId))
      .orderBy(desc(postCommentsTable.createdAt));
    return res.json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load comments" });
  }
});

router.post("/:id/comments", requireAuth, async (req: AuthRequest, res) => {
  try {
    const postId = Number(req.params.id);
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: "content required" });

    const post = await db.query.postsTable.findFirst({ where: eq(postsTable.id, postId) });
    if (!post) return res.status(404).json({ error: "Post not found" });

    const [comment] = await db
      .insert(postCommentsTable)
      .values({ postId, userId: req.user!.id, content: content.trim() })
      .returning();
    return res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create comment" });
  }
});

router.patch("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const post = await db.query.postsTable.findFirst({ where: eq(postsTable.id, Number(req.params.id)) });
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.userId !== req.user!.id) return res.status(403).json({ error: "Forbidden" });
    const [updated] = await db
      .update(postsTable)
      .set({ content: req.body.content, mediaUrl: req.body.mediaUrl, updatedAt: new Date() })
      .where(eq(postsTable.id, post.id))
      .returning();
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
