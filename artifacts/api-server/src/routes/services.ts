import { Router } from "express";
import { db } from "@workspace/db";
import {
  servicesTable,
  reviewsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * GET /api/services
 /
router.get("/", async (_req, res) => {
  try {
    const services =
      await db.query.servicesTable.findMany({
        orderBy: (services, { desc }) => [
          desc(services.createdAt),
        ],
      });

    return res.json(services);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load services",
    });
  }
});

/*
 * POST /api/services
 /
router.post("/", async (req, res) => {
  try {
    const {
      providerId,
      title,
      description,
      pricingFrom,
      category,
    } = req.body;

    if (!providerId || !title) {
      return res.status(400).json({
        error:
          "providerId and title are required",
      });
    }

    const [service] = await db
      .insert(servicesTable)
      .values({
        providerId,
        title,
        description,
        pricingFrom:
          pricingFrom?.toString(),
        category,
        status: "active",
      })
      .returning();

    return res.status(201).json(service);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to create service",
    });
  }
});

/*
 * GET /api/services/:id
 /
router.get("/:id", async (req, res) => {
  try {
    const service =
      await db.query.servicesTable.findFirst({
        where: eq(
          servicesTable.id,
          Number(req.params.id),
        ),
      });

    if (!service) {
      return res.status(404).json({
        error: "Service not found",
      });
    }

    return res.json(service);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load service",
    });
  }
});

/*
 * PATCH /api/services/:id
 /
router.patch("/:id", async (req, res) => {
  try {
    const [service] = await db
      .update(servicesTable)
      .set({
        ...req.body,
        updatedAt: new Date(),
      })
      .where(
        eq(
          servicesTable.id,
          Number(req.params.id),
        ),
      )
      .returning();

    if (!service) {
      return res.status(404).json({
        error: "Service not found",
      });
    }

    return res.json(service);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to update service",
    });
  }
});

/*
 * DELETE /api/services/:id
 /
router.delete("/:id", async (req, res) => {
  try {
    await db
      .delete(servicesTable)
      .where(
        eq(
          servicesTable.id,
          Number(req.params.id),
        ),
      );

    return res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to delete service",
    });
  }
});

/*
 * GET /api/services/:id/reviews
 */
router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews =
      await db.query.reviewsTable.findMany({
        where: eq(
          reviewsTable.subjectId,
          Number(req.params.id),
        ),
      });

    return res.json(reviews);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load service reviews",
    });
  }
});

export default router;