import { Router } from "express";
import { db } from "@workspace/db";
import {
  investmentsTable,
  investmentCommitmentsTable,
  walletsTable,
  transactionsTable,
} from "@workspace/db";
import { eq, and, ilike, desc, sql } from "drizzle-orm";
import { requireAuth, requireAdmin, optionalAuth, type AuthRequest } from "../middlewares/auth";

const router = Router();

function mapInvestment(inv: typeof investmentsTable.$inferSelect) {
  return {
    id: inv.id,
    creatorId: inv.creatorId,
    title: inv.title,
    company: inv.company,
    sector: inv.sector,
    description: inv.description,
    targetAmount: Number(inv.fundingGoal),
    raisedAmount: Number(inv.amountRaised),
    minInvestment: Number(inv.minInvestment),
    projectedReturn: Number(inv.returnRate),
    duration: inv.durationMonths,
    investorCount: inv.investorCount,
    risk: inv.risk as "low" | "medium" | "high",
    verified: inv.verified,
    status: inv.status,
    closingDate: inv.closingDate?.toISOString() ?? null,
    createdAt: inv.createdAt,
  };
}

// GET /api/investments — list with optional filters (public)
router.get("/", async (req, res) => {
  try {
    const { search, sector, status } = req.query;
    const conditions: any[] = [];

    if (search) conditions.push(ilike(investmentsTable.title, `%${search}%`));
    if (sector && sector !== "All") conditions.push(eq(investmentsTable.sector, String(sector)));
    if (status && status !== "all") {
      conditions.push(eq(investmentsTable.status, String(status)));
    } else {
      conditions.push(eq(investmentsTable.status, "active"));
    }

    const rows = await db.query.investmentsTable.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: [desc(investmentsTable.createdAt)],
    });

    const totalRaised = rows.reduce((s, r) => s + Number(r.amountRaised), 0);
    const avgReturn = rows.length
      ? Math.round(rows.reduce((s, r) => s + Number(r.returnRate), 0) / rows.length)
      : 0;

    return res.json({
      investments: rows.map(mapInvestment),
      stats: { totalRaised, avgReturn, activeDeals: rows.length },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load investments" });
  }
});

// GET /api/investments/portfolio — investor's own commitments (auth required)
router.get("/portfolio", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const commitments = await db.query.investmentCommitmentsTable.findMany({
      where: eq(investmentCommitmentsTable.investorId, userId),
      orderBy: [desc(investmentCommitmentsTable.createdAt)],
    });

    const investmentIds = [...new Set(commitments.map((c) => c.investmentId))];
    let investments: (typeof investmentsTable.$inferSelect)[] = [];
    if (investmentIds.length > 0) {
      investments = await db
        .select()
        .from(investmentsTable)
        .where(sql`${investmentsTable.id} = ANY(ARRAY[${sql.join(investmentIds.map((id) => sql`${id}`), sql`, `)}]::int[])`);
    }

    const invMap = new Map(investments.map((i) => [i.id, i]));

    const portfolio = commitments.map((c) => {
      const inv = invMap.get(c.investmentId);
      return {
        commitmentId: c.id,
        investmentId: c.investmentId,
        title: inv?.title ?? "Unknown",
        company: inv?.company ?? "",
        sector: inv?.sector ?? "",
        amount: Number(c.amount),
        projectedReturn: inv ? Number(inv.returnRate) : 0,
        durationMonths: inv?.durationMonths ?? 0,
        status: c.status,
        investmentStatus: inv?.status ?? "unknown",
        closingDate: inv?.closingDate?.toISOString() ?? null,
        committedAt: c.createdAt,
      };
    });

    const totalInvested = portfolio.reduce((s, p) => s + p.amount, 0);
    const projectedReturns = portfolio.reduce(
      (s, p) => s + p.amount * (p.projectedReturn / 100),
      0,
    );

    return res.json({ portfolio, totalInvested, projectedReturns });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load portfolio" });
  }
});

// GET /api/investments/:id — single project (public)
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const inv = await db.query.investmentsTable.findFirst({
      where: eq(investmentsTable.id, id),
    });

    if (!inv) return res.status(404).json({ error: "Investment not found" });

    return res.json(mapInvestment(inv));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load investment" });
  }
});

// POST /api/investments — admin/creator only creates an investment project
router.post("/", requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const creatorId = req.user!.id;
    const {
      title,
      company,
      sector,
      description,
      fundingGoal,
      minInvestment,
      returnRate,
      durationMonths,
      risk,
      verified,
      closingDate,
    } = req.body;

    if (!title || !company) {
      return res.status(400).json({ error: "title and company are required" });
    }

    const [row] = await db
      .insert(investmentsTable)
      .values({
        creatorId,
        title: String(title),
        company: String(company),
        sector: sector ?? "General",
        description: description ?? null,
        fundingGoal: String(fundingGoal ?? 0),
        minInvestment: String(minInvestment ?? 0),
        returnRate: String(returnRate ?? 0),
        durationMonths: Number(durationMonths ?? 12),
        risk: risk ?? "medium",
        verified: Boolean(verified ?? false),
        closingDate: closingDate ? new Date(closingDate) : null,
        status: "active",
      })
      .returning();

    return res.status(201).json(mapInvestment(row));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create investment" });
  }
});

// POST /api/investments/:id/commit — investor commits (auth required, fully transactional)
router.post("/:id/commit", requireAuth, async (req: AuthRequest, res) => {
  try {
    const investmentId = Number(req.params.id);
    if (isNaN(investmentId)) return res.status(400).json({ error: "Invalid id" });

    const investorId = req.user!.id;
    const { amount } = req.body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: "A valid positive amount is required" });
    }

    const amt = Number(amount);

    const result = await db.transaction(async (tx) => {
      // Lock the investment row to prevent concurrent commits racing
      const [inv] = await tx
        .select()
        .from(investmentsTable)
        .where(eq(investmentsTable.id, investmentId))
        .for("update");

      if (!inv) throw Object.assign(new Error("Investment not found"), { status: 404 });
      if (inv.status !== "active") throw Object.assign(new Error("Investment is not accepting commitments"), { status: 400 });
      if (amt < Number(inv.minInvestment)) {
        throw Object.assign(new Error(`Minimum investment is ₦${Number(inv.minInvestment).toLocaleString()}`), { status: 400 });
      }

      // Lock the wallet row for this user
      const [wallet] = await tx
        .select()
        .from(walletsTable)
        .where(eq(walletsTable.userId, investorId))
        .for("update");

      if (!wallet) throw Object.assign(new Error("Wallet not found"), { status: 404 });

      const currentBalance = Number(wallet.availableBalance);
      if (currentBalance < amt) {
        throw Object.assign(new Error("Insufficient wallet balance"), { status: 400 });
      }

      // Deduct from available, move to escrow — single atomic update
      await tx
        .update(walletsTable)
        .set({
          availableBalance: (currentBalance - amt).toFixed(2),
          escrowBalance: (Number(wallet.escrowBalance) + amt).toFixed(2),
        })
        .where(eq(walletsTable.id, wallet.id));

      // Record wallet transaction
      await tx.insert(transactionsTable).values({
        walletId: wallet.id,
        type: "escrow_hold",
        amount: String(amt),
        status: "completed",
        reference: `INV-${investmentId}`,
      });

      // Record commitment
      const [commitment] = await tx
        .insert(investmentCommitmentsTable)
        .values({
          investmentId,
          investorId,
          amount: String(amt),
          status: "held",
        })
        .returning();

      // Update investment counters atomically
      await tx
        .update(investmentsTable)
        .set({
          amountRaised: (Number(inv.amountRaised) + amt).toFixed(2),
          investorCount: inv.investorCount + 1,
          updatedAt: new Date(),
        })
        .where(eq(investmentsTable.id, investmentId));

      return commitment;
    });

    return res.status(201).json({ success: true, commitment: result });
  } catch (error: any) {
    console.error(error);
    const status = error?.status ?? 500;
    const message = status < 500 ? error.message : "Failed to commit investment";
    return res.status(status).json({ error: message });
  }
});

export default router;
