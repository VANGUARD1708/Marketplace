import { Router } from "express";
import { db } from "@workspace/db";
import {
  usersTable,
  listingsTable,
  adminReportsTable,
  verificationRequestsTable,
  escrowsTable,
  disputesTable,
} from "@workspace/db";
import { eq, desc, count } from "drizzle-orm";

const router = Router();

router.get("/users", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Number(req.query.offset) || 0;
    const users = await db.query.usersTable.findMany({ limit, offset, orderBy: [desc(usersTable.createdAt)] });
    const safe = users.map(({ passwordHash: _, ...u }) => u);
    return res.json({ users: safe, limit, offset });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load users" });
  }
});

router.get("/listings", async (req, res) => {
  try {
    const listings = await db.query.listingsTable.findMany({ orderBy: [desc(listingsTable.createdAt)] });
    return res.json(listings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load listings" });
  }
});

router.get("/reports", async (req, res) => {
  try {
    const reports = await db.query.adminReportsTable.findMany({ orderBy: [desc(adminReportsTable.createdAt)] });
    return res.json(reports);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load reports" });
  }
});

router.patch("/reports/:id", async (req, res) => {
  try {
    const { status, resolvedById } = req.body;
    const [report] = await db.update(adminReportsTable)
      .set({ status, resolvedById, resolvedAt: new Date() })
      .where(eq(adminReportsTable.id, Number(req.params.id)))
      .returning();
    if (!report) return res.status(404).json({ error: "Report not found" });
    return res.json({ success: true, report });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update report" });
  }
});

router.get("/verification-requests", async (_req, res) => {
  try {
    const requests = await db.query.verificationRequestsTable.findMany({
      orderBy: [desc(verificationRequestsTable.submittedAt)],
    });
    return res.json(requests);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load verification requests" });
  }
});

router.patch("/verification-requests/:id", async (req, res) => {
  try {
    const { status, reviewedById, reviewNotes } = req.body;
    const [row] = await db.update(verificationRequestsTable)
      .set({ status, reviewedById, reviewNotes, reviewedAt: new Date() })
      .where(eq(verificationRequestsTable.id, Number(req.params.id)))
      .returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json({ success: true, verification: row });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update verification request" });
  }
});

router.get("/escrow-cases", async (_req, res) => {
  try {
    const escrows = await db.query.escrowsTable.findMany({ orderBy: [desc(escrowsTable.createdAt)] });
    return res.json(escrows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load escrow cases" });
  }
});

router.get("/disputes", async (_req, res) => {
  try {
    const disputes = await db.query.disputesTable.findMany({ orderBy: [desc(disputesTable.createdAt)] });
    return res.json(disputes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load disputes" });
  }
});

router.patch("/disputes/:id", async (req, res) => {
  try {
    const { status, resolution } = req.body;
    const [dispute] = await db.update(disputesTable)
      .set({ status, resolution, resolvedAt: new Date() })
      .where(eq(disputesTable.id, Number(req.params.id)))
      .returning();
    if (!dispute) return res.status(404).json({ error: "Dispute not found" });
    return res.json({ success: true, dispute });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update dispute" });
  }
});

router.get("/stats", async (_req, res) => {
  try {
    const [[users], [listings], [escrows], [disputes], [verifications], [reports]] = await Promise.all([
      db.select({ count: count() }).from(usersTable),
      db.select({ count: count() }).from(listingsTable),
      db.select({ count: count() }).from(escrowsTable),
      db.select({ count: count() }).from(disputesTable),
      db.select({ count: count() }).from(verificationRequestsTable),
      db.select({ count: count() }).from(adminReportsTable),
    ]);
    return res.json({
      users: users?.count ?? 0,
      listings: listings?.count ?? 0,
      escrows: escrows?.count ?? 0,
      disputes: disputes?.count ?? 0,
      verifications: verifications?.count ?? 0,
      reports: reports?.count ?? 0,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load stats" });
  }
});

router.get("/guardian-alerts", (_req, res) => {
  return res.json([]);
});

router.post("/guardian-alerts/:id/resolve", (_req, res) => {
  return res.json({ success: true });
});

export default router;
