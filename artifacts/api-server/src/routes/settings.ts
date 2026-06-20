import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, linkedAccountsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth";
import { hashPassword, verifyPassword } from "../lib/auth";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, req.user!.id),
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    const { passwordHash: _, ...safe } = user;
    return res.json(safe);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load settings" });
  }
});

router.patch("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { email, username } = req.body;
    const [user] = await db.update(usersTable)
      .set({ email, username, updatedAt: new Date() })
      .where(eq(usersTable.id, req.user!.id))
      .returning();
    const { passwordHash: _, ...safe } = user;
    return res.json(safe);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update settings" });
  }
});

router.patch("/password", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "currentPassword and newPassword required" });
    }
    const user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, req.user!.id) });
    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await verifyPassword(user.passwordHash ?? "", currentPassword);
    if (!valid) return res.status(401).json({ error: "Current password incorrect" });

    if (newPassword.length < 8) return res.status(400).json({ error: "Password must be ≥8 characters" });

    const passwordHash = await hashPassword(newPassword);
    await db.update(usersTable).set({ passwordHash, updatedAt: new Date() }).where(eq(usersTable.id, req.user!.id));
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update password" });
  }
});

router.get("/linked-accounts", requireAuth, async (req: AuthRequest, res) => {
  try {
    const accounts = await db.query.linkedAccountsTable.findMany({
      where: eq(linkedAccountsTable.userId, req.user!.id),
    });
    return res.json(accounts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load linked accounts" });
  }
});

router.post("/linked-accounts", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { provider, providerAccountId } = req.body;
    if (!provider || !providerAccountId) {
      return res.status(400).json({ error: "provider and providerAccountId required" });
    }
    const [account] = await db.insert(linkedAccountsTable).values({
      userId: req.user!.id,
      provider,
      providerAccountId,
    }).returning();
    return res.status(201).json(account);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to link account" });
  }
});

router.delete("/linked-accounts/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(linkedAccountsTable).where(eq(linkedAccountsTable.id, Number(req.params.id)));
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to unlink account" });
  }
});

export default router;
