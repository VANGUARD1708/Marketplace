import { Router } from "express";
import { db } from "@workspace/db";
import {
  escrowsTable,
  walletsTable,
  transactionsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * GET /api/escrow
 */
router.get("/", async (_req, res) => {
  try {
    const escrows = await db.query.escrowsTable.findMany({
      orderBy: (escrows, { desc }) => [
        desc(escrows.createdAt),
      ],
    });

    return res.json(escrows);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load escrows",
    });
  }
});

/**
 * GET /api/escrow/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const escrow = await db.query.escrowsTable.findFirst({
      where: eq(
        escrowsTable.id,
        Number(req.params.id),
      ),
    });

    if (!escrow) {
      return res.status(404).json({
        error: "Escrow not found",
      });
    }

    return res.json(escrow);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load escrow",
    });
  }
});

/**
 * POST /api/escrow
 */
router.post("/", async (req, res) => {
  try {
    const {
      buyerId,
      sellerId,
      orderId,
      amount,
    } = req.body;

    const [escrow] = await db
      .insert(escrowsTable)
      .values({
        buyerId,
        sellerId,
        orderId,
        amount: String(amount),
        status: "active",
      })
      .returning();

    return res.status(201).json(escrow);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to create escrow",
    });
  }
});

/**
 * POST /api/escrow/:id/release
 */
router.post("/:id/release", async (req, res) => {
  try {
    const escrow = await db.query.escrowsTable.findFirst({
      where: eq(
        escrowsTable.id,
        Number(req.params.id),
      ),
    });

    if (!escrow) {
      return res.status(404).json({
        error: "Escrow not found",
      });
    }

    const sellerWallet =
      await db.query.walletsTable.findFirst({
        where: eq(
          walletsTable.userId,
          escrow.sellerId,
        ),
      });

    if (!sellerWallet) {
      return res.status(404).json({
        error: "Seller wallet not found",
      });
    }

    const amount = Number(escrow.amount);

    await db
      .update(walletsTable)
      .set({
        availableBalance: (
          Number(
            sellerWallet.availableBalance,
          ) + amount
        ).toFixed(2),
      })
      .where(
        eq(walletsTable.id, sellerWallet.id),
      );

    await db.insert(transactionsTable).values({
      walletId: sellerWallet.id,
      type: "escrow_release",
      amount: String(amount),
      status: "completed",
    });

    const [updatedEscrow] = await db
      .update(escrowsTable)
      .set({
        status: "released",
        releasedAt: new Date(),
      })
      .where(
        eq(
          escrowsTable.id,
          escrow.id,
        ),
      )
      .returning();

    return res.json({
      success: true,
      escrow: updatedEscrow,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to release escrow",
    });
  }
});

/**
 * POST /api/escrow/:id/dispute
 */
router.post("/:id/dispute", async (req, res) => {
  try {
    const [escrow] = await db
      .update(escrowsTable)
      .set({
        status: "disputed",
      })
      .where(
        eq(
          escrowsTable.id,
          Number(req.params.id),
        ),
      )
      .returning();

    if (!escrow) {
      return res.status(404).json({
        error: "Escrow not found",
      });
    }

    return res.json({
      success: true,
      escrow,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to dispute escrow",
    });
  }
});

export default router;