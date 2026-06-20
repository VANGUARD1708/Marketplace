import { Router } from "express";
import { db } from "@workspace/db";
import {
  profilesTable,
  followersTable,
} from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

/**
 * GET /api/profiles/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const profile = await db.query.profilesTable.findFirst({
      where: eq(
        profilesTable.userId,
        Number(req.params.id)
      ),
    });

    if (!profile) {
      return res.status(404).json({
        error: "Profile not found",
      });
    }

    return res.json(profile);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load profile",
    });
  }
});

/**
 * PATCH /api/profiles/:id
 */
router.patch("/:id", async (req, res) => {
  try {
    const {
      displayName,
      bio,
      avatarUrl,
      coverPhotoUrl,
      location,
      website,
    } = req.body;

    const [profile] = await db
      .update(profilesTable)
      .set({
        displayName,
        bio,
        avatarUrl,
        coverPhotoUrl,
        location,
        website,
        updatedAt: new Date(),
      })
      .where(
        eq(
          profilesTable.userId,
          Number(req.params.id)
        )
      )
      .returning();

    return res.json(profile);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to update profile",
    });
  }
});

/**
 * GET /api/profiles/:id/followers
 */
router.get("/:id/followers", async (req, res) => {
  try {
    const followers = await db.query.followersTable.findMany({
      where: eq(
        followersTable.followingId,
        Number(req.params.id)
      ),
    });

    return res.json(followers);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load followers",
    });
  }
});

/**
 * GET /api/profiles/:id/following
 */
router.get("/:id/following", async (req, res) => {
  try {
    const following = await db.query.followersTable.findMany({
      where: eq(
        followersTable.followerId,
        Number(req.params.id)
      ),
    });

    return res.json(following);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load following",
    });
  }
});

/**
 * POST /api/profiles/:id/follow
 *
 * body:
 * {
 *   followerId: number
 * }
 */
router.post("/:id/follow", async (req, res) => {
  try {
    const { followerId } = req.body;

    if (!followerId) {
      return res.status(400).json({
        error: "followerId required",
      });
    }

    const [follow] = await db
      .insert(followersTable)
      .values({
        followerId,
        followingId: Number(req.params.id),
      })
      .returning();

    return res.status(201).json(follow);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to follow user",
    });
  }
});

/**
 * DELETE /api/profiles/:id/follow
 *
 * body:
 * {
 *   followerId: number
 * }
 */
router.delete("/:id/follow", async (req, res) => {
  try {
    const { followerId } = req.body;

    await db
      .delete(followersTable)
      .where(
        and(
          eq(
            followersTable.followerId,
            followerId
          ),
          eq(
            followersTable.followingId,
            Number(req.params.id)
          )
        )
      );

    return res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to unfollow user",
    });
  }
});

export default router;