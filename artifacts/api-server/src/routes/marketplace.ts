import { Router } from "express";
import { db } from "@workspace/db";
import { listingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * GET /api/marketplace/listings
 */
router.get("/listings", async (_req, res) => {
  try {
    const listings =
      await db.query.listingsTable.findMany({
        orderBy: (listings, { desc }) => [
          desc(listings.createdAt),
        ],
      });

    return res.json(listings);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load listings",
    });
  }
});

/**
 * GET /api/marketplace/listings/:id
 */
router.get("/listings/:id", async (req, res) => {
  try {
    const listing =
      await db.query.listingsTable.findFirst({
        where: eq(
          listingsTable.id,
          Number(req.params.id),
        ),
      });

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found",
      });
    }

    return res.json(listing);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load listing",
    });
  }
});

/**
 * POST /api/marketplace/listings
 */
router.post("/listings", async (req, res) => {
  try {
    const {
      sellerId,
      title,
      description,
      price,
      category,
      condition,
    } = req.body;

    if (!sellerId || !title || !price) {
      return res.status(400).json({
        error:
          "sellerId, title and price are required",
      });
    }

    const [listing] = await db
      .insert(listingsTable)
      .values({
        sellerId,
        title,
        description,
        price: String(price),
        category,
        condition,
        status: "active",
      })
      .returning();

    return res.status(201).json(listing);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to create listing",
    });
  }
});

/**
 * PATCH /api/marketplace/listings/:id
 */
router.patch("/listings/:id", async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      condition,
      status,
    } = req.body;

    const [listing] = await db
      .update(listingsTable)
      .set({
        title,
        description,
        price:
          price !== undefined
            ? String(price)
            : undefined,
        category,
        condition,
        status,
        updatedAt: new Date(),
      })
      .where(
        eq(
          listingsTable.id,
          Number(req.params.id),
        ),
      )
      .returning();

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found",
      });
    }

    return res.json(listing);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to update listing",
    });
  }
});

/**
 * DELETE /api/marketplace/listings/:id
 */
router.delete("/listings/:id", async (req, res) => {
  try {
    await db
      .delete(listingsTable)
      .where(
        eq(
          listingsTable.id,
          Number(req.params.id),
        ),
      );

    return res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to delete listing",
    });
  }
});

export default router;