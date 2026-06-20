import { Router } from "express";
import { db } from "@workspace/db";
import {
  disputesTable,
  escrowsTable,
  notificationsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * GET /api/disputes
 */
router.get("/", async (_req, res) => {
  try {
    const disputes =
      await db.query.disputesTable.findMany({
        orderBy: (disputes, { desc }) => [
          desc(disputes.createdAt),
        ],
      });

    res.json(disputes);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to load disputes",
    });
  }
});

/**
 * GET /api/disputes/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const dispute =
      await db.query.disputesTable.findFirst({
        where: eq(
          disputesTable.id,
          Number(req.params.id),
        ),
      });

    if (!dispute) {
      return res.status(404).json({
        error: "Dispute not found",
      });
    }

    res.json(dispute);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to load dispute",
    });
  }
});

/**
 * POST /api/disputes
 */
router.post("/", async (req, res) => {
  try {
    const {
      orderId,
      escrowId,
      raisedById,
      reason,
    } = req.body;

    if (!raisedById || !reason) {
      return res.status(400).json({
        error:
          "raisedById and reason are required",
      });
    }

    const [dispute] = await db
      .insert(disputesTable)
      .values({
        orderId,
        escrowId,
        raisedById,
        reason,
        status: "open",
      })
      .returning();

    if (escrowId) {
      await db
        .update(escrowsTable)
        .set({
          status: "disputed",
        })
        .where(
          eq(
            escrowsTable.id,
            escrowId,
          ),
        );
    }

    res.status(201).json(dispute);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create dispute",
    });
  }
});

/**
 * PATCH /api/disputes/:id/resolve
 */
router.patch(
  "/:id/resolve",
  async (req, res) => {
    try {
      const { resolution } = req.body;

      const [dispute] = await db
        .update(disputesTable)
        .set({
          status: "resolved",
          resolution,
          resolvedAt: new Date(),
        })
        .where(
          eq(
            disputesTable.id,
            Number(req.params.id),
          ),
        )
        .returning();

      if (!dispute) {
        return res.status(404).json({
          error: "Dispute not found",
        });
      }

      res.json({
        success: true,
        dispute,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to resolve dispute",
      });
    }
  },
);

export default router;