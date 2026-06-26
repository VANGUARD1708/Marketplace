import { Router } from "express";
import { db } from "@workspace/db";
import {
  communitiesTable,
  communityMembersTable,
  postsTable,
  profilesTable,
  usersTable,
} from "@workspace/db";
import { eq, and, desc, sql } from "drizzle-orm";
import { requireAuth, optionalAuth, type AuthRequest } from "../middlewares/auth";

const router = Router();

router.get("/", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const communities = await db.select().from(communitiesTable).orderBy(desc(communitiesTable.memberCount));

    if (userId) {
      const memberships = await db
        .select({ communityId: communityMembersTable.communityId })
        .from(communityMembersTable)
        .where(eq(communityMembersTable.userId, userId));
      const joinedSet = new Set(memberships.map((m) => m.communityId));
      const result = communities.map((c) => ({ ...c, isJoined: joinedSet.has(c.id) }));
      return res.json(result);
    }

    return res.json(communities.map((c) => ({ ...c, isJoined: false })));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load communities" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, description, category, isPrivate, trustRequired, coverColor } = req.body;
    if (!name?.trim() || !description?.trim()) {
      return res.status(400).json({ error: "name and description required" });
    }
    const [community] = await db
      .insert(communitiesTable)
      .values({
        name: name.trim(),
        description: description.trim(),
        category: category ?? "General",
        isPrivate: isPrivate ?? false,
        trustRequired: trustRequired ?? 0,
        coverColor: coverColor ?? "from-blue-500 to-blue-700",
        createdBy: req.user!.id,
        memberCount: 1,
      })
      .returning();

    await db.insert(communityMembersTable).values({
      communityId: community.id,
      userId: req.user!.id,
    });

    return res.status(201).json({ ...community, isJoined: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create community" });
  }
});

router.get("/:id", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const community = await db.query.communitiesTable.findFirst({
      where: eq(communitiesTable.id, Number(req.params.id)),
    });
    if (!community) return res.status(404).json({ error: "Community not found" });

    let isJoined = false;
    if (req.user) {
      const membership = await db.query.communityMembersTable.findFirst({
        where: and(
          eq(communityMembersTable.communityId, community.id),
          eq(communityMembersTable.userId, req.user.id),
        ),
      });
      isJoined = Boolean(membership);
    }

    return res.json({ ...community, isJoined });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load community" });
  }
});

router.post("/:id/join", requireAuth, async (req: AuthRequest, res) => {
  try {
    const communityId = Number(req.params.id);
    const userId = req.user!.id;

    const community = await db.query.communitiesTable.findFirst({
      where: eq(communitiesTable.id, communityId),
    });
    if (!community) return res.status(404).json({ error: "Community not found" });

    const existing = await db.query.communityMembersTable.findFirst({
      where: and(
        eq(communityMembersTable.communityId, communityId),
        eq(communityMembersTable.userId, userId),
      ),
    });
    if (existing) return res.status(409).json({ error: "Already a member" });

    await db.insert(communityMembersTable).values({ communityId, userId });
    await db
      .update(communitiesTable)
      .set({ memberCount: sql`${communitiesTable.memberCount} + 1` })
      .where(eq(communitiesTable.id, communityId));

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to join community" });
  }
});

router.delete("/:id/leave", requireAuth, async (req: AuthRequest, res) => {
  try {
    const communityId = Number(req.params.id);
    const userId = req.user!.id;

    const deleted = await db
      .delete(communityMembersTable)
      .where(
        and(
          eq(communityMembersTable.communityId, communityId),
          eq(communityMembersTable.userId, userId),
        ),
      )
      .returning();

    if (deleted.length === 0) {
      return res.status(400).json({ error: "Not a member of this community" });
    }

    await db
      .update(communitiesTable)
      .set({ memberCount: sql`GREATEST(${communitiesTable.memberCount} - 1, 0)` })
      .where(eq(communitiesTable.id, communityId));

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to leave community" });
  }
});

router.get("/:id/posts", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const communityId = Number(req.params.id);
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const offset = Number(req.query.offset) || 0;

    const posts = await db
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
      .where(eq(postsTable.communityId, communityId))
      .orderBy(desc(postsTable.createdAt))
      .limit(limit)
      .offset(offset);

    return res.json({ posts, limit, offset });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load community posts" });
  }
});

router.get("/:id/members", async (req, res) => {
  try {
    const communityId = Number(req.params.id);
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const offset = Number(req.query.offset) || 0;

    const members = await db
      .select({
        userId: communityMembersTable.userId,
        joinedAt: communityMembersTable.joinedAt,
        displayName: profilesTable.displayName,
        avatarUrl: profilesTable.avatarUrl,
        username: usersTable.username,
      })
      .from(communityMembersTable)
      .leftJoin(profilesTable, eq(profilesTable.userId, communityMembersTable.userId))
      .leftJoin(usersTable, eq(usersTable.id, communityMembersTable.userId))
      .where(eq(communityMembersTable.communityId, communityId))
      .orderBy(desc(communityMembersTable.joinedAt))
      .limit(limit)
      .offset(offset);

    return res.json(members);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load members" });
  }
});

export default router;
