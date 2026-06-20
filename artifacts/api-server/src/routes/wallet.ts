import { Router } from "express";
import { db } from "@workspace/db";
import {
  walletsTable,
  transactionsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * GET /api/wallet?userId=1
 */
router.get("/", async (req, res) => {
  try {
    const userId = Number(req.query.userId);

    if (!userId) {
      return res.status(400).json({
        error: "userId required",
      });
    }

    const wallet = await db.query.walletsTable.findFirst({
      where: eq(walletsTable.userId, userId),
    });

    if (!wallet) {
      return res.status(404).json({
        error: "Wallet not found",
      });
    }

    return res.json(wallet);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load wallet",
    });
  }
});

/**
 * GET /api/wallet/transactions?userId=1
 */
router.get("/transactions", async (req, res) => {
  try {
    const userId = Number(req.query.userId);

    if (!userId) {
      return res.status(400).json({
        error: "userId required",
      });
    }

    const wallet = await db.query.walletsTable.findFirst({
      where: eq(walletsTable.userId, userId),
    });

    if (!wallet) {
      return res.status(404).json({
        error: "Wallet not found",
      });
    }

    const transactions =
      await db.query.transactionsTable.findMany({
        where: eq(
          transactionsTable.walletId,
          wallet.id,
        ),
        orderBy: (transactions, { desc }) => [
          desc(transactions.createdAt),
        ],
      });

    return res.json(transactions);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load transactions",
    });
  }
});

/**
 * POST /api/wallet/deposit
 */
router.post("/deposit", async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({
        error: "userId and amount required",
      });
    }

    const wallet = await db.query.walletsTable.findFirst({
      where: eq(walletsTable.userId, userId),
    });

    if (!wallet) {
      return res.status(404).json({
        error: "Wallet not found",
      });
    }

    const newBalance =
      Number(wallet.availableBalance) +
      Number(amount);

    const [updatedWallet] = await db
      .update(walletsTable)
      .set({
        availableBalance:
          newBalance.toFixed(2),
      })
      .where(eq(walletsTable.id, wallet.id))
      .returning();

    const [transaction] = await db
      .insert(transactionsTable)
      .values({
        walletId: wallet.id,
        type: "deposit",
        amount: String(amount),
        status: "completed",
      })
      .returning();

    return res.json({
      success: true,
      wallet: updatedWallet,
      transaction,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Deposit failed",
    });
  }
});

/**
 * POST /api/wallet/withdraw
 */
router.post("/withdraw", async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({
        error: "userId and amount required",
      });
    }

    const wallet = await db.query.walletsTable.findFirst({
      where: eq(walletsTable.userId, userId),
    });

    if (!wallet) {
      return res.status(404).json({
        error: "Wallet not found",
      });
    }

    const currentBalance = Number(
      wallet.availableBalance,
    );

    if (currentBalance < Number(amount)) {
      return res.status(400).json({
        error: "Insufficient balance",
      });
    }

    const newBalance =
      currentBalance - Number(amount);

    const [updatedWallet] = await db
      .update(walletsTable)
      .set({
        availableBalance:
          newBalance.toFixed(2),
      })
      .where(eq(walletsTable.id, wallet.id))
      .returning();

    const [transaction] = await db
      .insert(transactionsTable)
      .values({
        walletId: wallet.id,
        type: "withdraw",
        amount: String(amount),
        status: "completed",
      })
      .returning();

    return res.json({
      success: true,
      wallet: updatedWallet,
      transaction,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Withdrawal failed",
    });
  }
});

export default router;