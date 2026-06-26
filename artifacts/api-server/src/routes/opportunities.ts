import { Router } from "express";
import { db } from "@workspace/db";
import {
  opportunitiesTable,
  savedOpportunitiesTable,
} from "@workspace/db";
import { eq, and, ilike, desc, sql, gte, lte } from "drizzle-orm";
import { requireAuth, requireAdmin, optionalAuth, type AuthRequest } from "../middlewares/auth";

const router = Router();

function mapOpportunity(
  opp: typeof opportunitiesTable.$inferSelect,
  savedByUser?: boolean,
) {
  return {
    id: opp.id,
    title: opp.title,
    description: opp.description,
    category: opp.category,
    organization: opp.organization,
    location: opp.location,
    value: opp.value,
    eligibility: opp.eligibility,
    applyUrl: opp.applyUrl,
    deadline: opp.deadline?.toISOString() ?? null,
    verified: opp.verified,
    status: opp.status,
    views: opp.views,
    saves: opp.saves,
    createdAt: opp.createdAt,
    saved: savedByUser ?? false,
  };
}

// GET /api/opportunities — list with optional filters (public; saved state if auth token present)
router.get("/", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { search, category, location, verified, deadlineWindow } = req.query;
    const conditions: any[] = [eq(opportunitiesTable.status, "active")];

    if (search) conditions.push(ilike(opportunitiesTable.title, `%${search}%`));
    if (category && category !== "all" && category !== "All") {
      conditions.push(eq(opportunitiesTable.category, String(category).toLowerCase()));
    }
    if (location && location !== "Anywhere") {
      conditions.push(ilike(opportunitiesTable.location, `%${location}%`));
    }
    if (verified === "true") conditions.push(eq(opportunitiesTable.verified, true));
    if (deadlineWindow && deadlineWindow !== "") {
      const days = deadlineWindow === "7d" ? 7 : deadlineWindow === "30d" ? 30 : 90;
      const cutoff = new Date(Date.now() + days * 86400_000);
      // Only include rows that have a deadline AND it falls within the window
      conditions.push(gte(opportunitiesTable.deadline, new Date()));
      conditions.push(lte(opportunitiesTable.deadline, cutoff));
    }

    const rows = await db.query.opportunitiesTable.findMany({
      where: and(...conditions),
      orderBy: [desc(opportunitiesTable.createdAt)],
    });

    // Saved state derived from authenticated user only — never from caller-supplied param
    let savedIds = new Set<number>();
    if (req.user) {
      const saved = await db.query.savedOpportunitiesTable.findMany({
        where: eq(savedOpportunitiesTable.userId, req.user.id),
      });
      savedIds = new Set(saved.map((s) => s.opportunityId));
    }

    return res.json(rows.map((r) => mapOpportunity(r, savedIds.has(r.id))));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load opportunities" });
  }
});

// GET /api/opportunities/saved/list — user's bookmarks (auth required)
router.get("/saved/list", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const saved = await db.query.savedOpportunitiesTable.findMany({
      where: eq(savedOpportunitiesTable.userId, userId),
      orderBy: [desc(savedOpportunitiesTable.createdAt)],
    });

    if (saved.length === 0) return res.json([]);

    const ids = saved.map((s) => s.opportunityId);
    const opps = await db
      .select()
      .from(opportunitiesTable)
      .where(sql`${opportunitiesTable.id} = ANY(ARRAY[${sql.join(ids.map((id) => sql`${id}`), sql`, `)}]::int[])`);

    return res.json(opps.map((o) => mapOpportunity(o, true)));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load saved opportunities" });
  }
});

// GET /api/opportunities/:id — single opportunity (public, increments views; saved state if auth)
router.get("/:id", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const opp = await db.query.opportunitiesTable.findFirst({
      where: eq(opportunitiesTable.id, id),
    });
    if (!opp) return res.status(404).json({ error: "Opportunity not found" });

    await db
      .update(opportunitiesTable)
      .set({ views: opp.views + 1 })
      .where(eq(opportunitiesTable.id, id));

    // Saved state from authenticated user only — never from caller-supplied param
    let saved = false;
    if (req.user) {
      const s = await db.query.savedOpportunitiesTable.findFirst({
        where: and(
          eq(savedOpportunitiesTable.userId, req.user.id),
          eq(savedOpportunitiesTable.opportunityId, id),
        ),
      });
      saved = !!s;
    }

    return res.json(mapOpportunity({ ...opp, views: opp.views + 1 }, saved));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load opportunity" });
  }
});

// POST /api/opportunities — admin only creates an opportunity
router.post("/", requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const creatorId = req.user!.id;
    const {
      title,
      description,
      category,
      organization,
      location,
      value,
      eligibility,
      applyUrl,
      deadline,
      verified,
    } = req.body;

    if (!title) return res.status(400).json({ error: "title is required" });

    const [row] = await db
      .insert(opportunitiesTable)
      .values({
        creatorId,
        title: String(title),
        description: description ?? null,
        category: (category ?? "general").toLowerCase(),
        organization: organization ?? null,
        location: location ?? null,
        value: value ?? null,
        eligibility: eligibility ?? null,
        applyUrl: applyUrl ?? null,
        deadline: deadline ? new Date(deadline) : null,
        verified: Boolean(verified ?? false),
        status: "active",
      })
      .returning();

    return res.status(201).json(mapOpportunity(row));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create opportunity" });
  }
});

// POST /api/opportunities/:id/save — bookmark (auth required)
router.post("/:id/save", requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const userId = req.user!.id;

    // Verify opportunity exists before inserting
    const opp = await db.query.opportunitiesTable.findFirst({
      where: eq(opportunitiesTable.id, id),
    });
    if (!opp) return res.status(404).json({ error: "Opportunity not found" });

    // ON CONFLICT DO NOTHING — unique constraint prevents duplicates;
    // returning() will be empty if the row already existed (idempotent)
    const inserted = await db
      .insert(savedOpportunitiesTable)
      .values({ userId, opportunityId: id })
      .onConflictDoNothing()
      .returning();

    // Only increment counter if a new row was actually inserted
    if (inserted.length > 0) {
      await db
        .update(opportunitiesTable)
        .set({ saves: opp.saves + 1 })
        .where(eq(opportunitiesTable.id, id));
    }

    return res.status(inserted.length > 0 ? 201 : 200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to save opportunity" });
  }
});

// DELETE /api/opportunities/:id/save — remove bookmark (auth required)
router.delete("/:id/save", requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const userId = req.user!.id;

    // Use returning() to know if a row was actually deleted
    const deleted = await db
      .delete(savedOpportunitiesTable)
      .where(
        and(
          eq(savedOpportunitiesTable.userId, userId),
          eq(savedOpportunitiesTable.opportunityId, id),
        ),
      )
      .returning();

    // Only decrement counter if a row was actually removed
    if (deleted.length > 0) {
      await db
        .update(opportunitiesTable)
        .set({ saves: sql`GREATEST(saves - 1, 0)` })
        .where(eq(opportunitiesTable.id, id));
    }

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to unsave opportunity" });
  }
});

export default router;
