import { Router } from "express";
import { db } from "@workspace/db";
import {
  trustScoresTable,
  trustHistoryTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * GET /api/trust/:userId
 */
router.get("/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const trust =
      await db.query.trustScoresTable.findFirst({
        where: eq(
          trustScoresTable.userId,
          userId,
        ),
      });

    if (!trust) {
      return res.status(404).json({
        error: "Trust profile not found",
      });
    }

    const score = Number(trust.score);

    let badge = "New Member";

    if (score >= 90) badge = "Trusted Seller";
    else if (score >= 75) badge = "Verified Merchant";
    else if (score >= 60) badge = "Reliable User";

    return res.json({
      userId,
      trustScore: score,
      badge,
      updatedAt: trust.updatedAt,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load trust profile",
    });
  }
});

/**
 * GET /api/trust/:userId/history
 */
router.get(
  "/:userId/history",
  async (req, res) => {
    try {
      const userId = Number(
        req.params.userId,
      );

      const history =
        await db.query.trustHistoryTable.findMany({
          where: eq(
            trustHistoryTable.userId,
            userId,
          ),
          orderBy: (history, { desc }) => [
            desc(history.createdAt),
          ],
        });

      return res.json(history);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Failed to load trust history",
      });
    }
  },
);

/**
 * Internal Helper
 */
export async function updateTrustScore(
  userId: number,
  scoreChange: number,
  action: string,
) {
  let trust =
    await db.query.trustScoresTable.findFirst({
      where: eq(
        trustScoresTable.userId,
        userId,
      ),
    });

  if (!trust) {
    const [created] = await db
      .insert(trustScoresTable)
      .values({
        userId,
        score: "50",
      })
      .returning();

    trust = created;
  }

  const newScore = Math.max(
    0,
    Math.min(
      100,
      Number(trust.score) + scoreChange,
    ),
  );

  await db
    .update(trustScoresTable)
    .set({
      score: String(newScore),
      updatedAt: new Date(),
    })
    .where(
      eq(
        trustScoresTable.userId,
        userId,
      ),
    );

  await db
    .insert(trustHistoryTable)
    .values({
      userId,
      action,
      scoreChange,
    });

  return newScore;
}

export default router;