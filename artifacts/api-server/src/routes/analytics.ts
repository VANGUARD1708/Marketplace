import { Router } from "express";
import { db } from "@workspace/db";
import {
  usersTable,
  listingsTable,
  transactionsTable,
  ordersTable,
} from "@workspace/db";
import { count, sum } from "drizzle-orm";

const router = Router();

router.get("/overview", async (_req, res) => {
  try {
    const [[{ value: totalUsers }], [{ value: totalListings }], [{ value: totalOrders }]] = await Promise.all([
      db.select({ value: count() }).from(usersTable),
      db.select({ value: count() }).from(listingsTable),
      db.select({ value: count() }).from(ordersTable),
    ]);

    const [{ total }] = await db.select({ total: sum(transactionsTable.amount) }).from(transactionsTable);

    return res.json({
      totalUsers,
      totalListings,
      totalOrders,
      totalTransactionVolume: total ?? "0",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load analytics overview" });
  }
});

router.get("/users", async (_req, res) => {
  try {
    const [{ value: total }] = await db.select({ value: count() }).from(usersTable);
    return res.json({ total });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load user analytics" });
  }
});

router.get("/listings", async (_req, res) => {
  try {
    const [{ value: total }] = await db.select({ value: count() }).from(listingsTable);
    return res.json({ total });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load listing analytics" });
  }
});

router.get("/transactions", async (_req, res) => {
  try {
    const [{ value: total }] = await db.select({ value: count() }).from(transactionsTable);
    const [{ volume }] = await db.select({ volume: sum(transactionsTable.amount) }).from(transactionsTable);
    return res.json({ total, volume: volume ?? "0" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load transaction analytics" });
  }
});

export default router;
