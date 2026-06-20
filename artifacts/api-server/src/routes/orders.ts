import { Router } from "express";
import { db } from "@workspace/db";
import {
  ordersTable,
  escrowsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * GET /api/orders
 */
router.get("/", async (_req, res) => {
  try {
    const orders = await db.query.ordersTable.findMany({
      orderBy: (orders, { desc }) => [
        desc(orders.createdAt),
      ],
    });

    return res.json(orders);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load orders",
    });
  }
});

/**
 * POST /api/orders
 */
router.post("/", async (req, res) => {
  try {
    const {
      buyerId,
      sellerId,
      listingId,
      amount,
    } = req.body;

    if (
      !buyerId ||
      !sellerId ||
      !amount
    ) {
      return res.status(400).json({
        error:
          "buyerId, sellerId and amount are required",
      });
    }

    const [order] = await db
      .insert(ordersTable)
      .values({
        buyerId,
        sellerId,
        listingId,
        amount: String(amount),
        status: "pending",
      })
      .returning();

    // Auto-create escrow
    const [escrow] = await db
      .insert(escrowsTable)
      .values({
        buyerId,
        sellerId,
        orderId: order.id,
        amount: String(amount),
        status: "active",
      })
      .returning();

    return res.status(201).json({
      success: true,
      order,
      escrow,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to create order",
    });
  }
});

/**
 * GET /api/orders/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const order =
      await db.query.ordersTable.findFirst({
        where: eq(
          ordersTable.id,
          Number(req.params.id),
        ),
      });

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    return res.json(order);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load order",
    });
  }
});

/**
 * PATCH /api/orders/:id/status
 */
router.patch(
  "/:id/status",
  async (req, res) => {
    try {
      const { status } = req.body;

      const [order] = await db
        .update(ordersTable)
        .set({
          status,
          updatedAt: new Date(),
        })
        .where(
          eq(
            ordersTable.id,
            Number(req.params.id),
          ),
        )
        .returning();

      if (!order) {
        return res.status(404).json({
          error: "Order not found",
        });
      }

      return res.json(order);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Failed to update order",
      });
    }
  },
);

export default router;