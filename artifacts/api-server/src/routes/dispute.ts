import { Router } from "express";
import { db } from "@workspace/db";
import {
  disputesTable,
  escrowsTable,
} from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

/**
 * GET /api/disputes
 */
router.get("/", async (_req, res) => {
  try {
    const disputes =
      await db.query.disputesTable.findMany({
        orderBy: [desc(disputesTable.createdAt)],
      });

    return res.json(disputes);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
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

    return res.json(dispute);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
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

    return res.status(201).json(dispute);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
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

      return res.json({
        success: true,
        dispute,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Failed to resolve dispute",
      });
    }
  },
);

export default router;