import { Router } from "express";
import { db } from "@workspace/db";
import { notificationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * GET /api/notifications?userId=1
 */
router.get("/", async (req, res) => {
  try {
    const userId = Number(req.query.userId);

    if (!userId) {
      return res.status(400).json({
        error: "userId required",
      });
    }

    const notifications =
      await db.query.notificationsTable.findMany({
        where: eq(
          notificationsTable.userId,
          userId,
        ),
        orderBy: (notifications, { desc }) => [
          desc(notifications.createdAt),
        ],
      });

    return res.json(notifications);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load notifications",
    });
  }
});

/**
 * PATCH /api/notifications/:id/read
 */
router.patch("/:id/read", async (req, res) => {
  try {
    const [notification] = await db
      .update(notificationsTable)
      .set({
        isRead: true,
      })
      .where(
        eq(
          notificationsTable.id,
          Number(req.params.id),
        ),
      )
      .returning();

    if (!notification) {
      return res.status(404).json({
        error: "Notification not found",
      });
    }

    return res.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to update notification",
    });
  }
});

/**
 * POST /api/notifications/read-all
 */
router.post("/read-all", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "userId required",
      });
    }

    await db
      .update(notificationsTable)
      .set({
        isRead: true,
      })
      .where(
        eq(
          notificationsTable.userId,
          userId,
        ),
      );

    return res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to mark notifications",
    });
  }
});

/**
 * Helper function
 */
export async function createNotification(
  userId: number,
  type: string,
  title: string,
  body?: string,
) {
  await db.insert(notificationsTable).values({
    userId,
    type,
    title,
    body,
    isRead: false,
  });
}

export default router;