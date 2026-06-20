import { Router } from "express";
import { db } from "@workspace/db";
import { companiesTable, companyMembersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const companies = await db.query.companiesTable.findMany({
      orderBy: [desc(companiesTable.createdAt)],
    });
    return res.json(companies);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load companies" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, description, website } = req.body;
    if (!name) return res.status(400).json({ error: "name required" });

    const [company] = await db.insert(companiesTable).values({
      ownerId: req.user!.id,
      name,
      description,
      website,
      status: "active",
    }).returning();

    await db.insert(companyMembersTable).values({
      companyId: company.id,
      userId: req.user!.id,
      role: "owner",
    });

    return res.status(201).json(company);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create company" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const company = await db.query.companiesTable.findFirst({
      where: eq(companiesTable.id, Number(req.params.id)),
    });
    if (!company) return res.status(404).json({ error: "Company not found" });
    return res.json(company);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load company" });
  }
});

router.patch("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, description, logoUrl, coverPhotoUrl, website } = req.body;
    const [company] = await db.update(companiesTable)
      .set({ name, description, logoUrl, coverPhotoUrl, website, updatedAt: new Date() })
      .where(eq(companiesTable.id, Number(req.params.id)))
      .returning();
    if (!company) return res.status(404).json({ error: "Company not found" });
    return res.json(company);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update company" });
  }
});

router.get("/:id/members", async (req, res) => {
  try {
    const members = await db.query.companyMembersTable.findMany({
      where: eq(companyMembersTable.companyId, Number(req.params.id)),
    });
    return res.json(members);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load members" });
  }
});

router.post("/:id/members", async (req, res) => {
  try {
    const { userId, role = "member" } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });
    const [member] = await db.insert(companyMembersTable).values({
      companyId: Number(req.params.id),
      userId: Number(userId),
      role,
    }).returning();
    return res.status(201).json(member);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add member" });
  }
});

router.delete("/:id/members/:userId", async (req, res) => {
  try {
    await db.delete(companyMembersTable).where(
      eq(companyMembersTable.companyId, Number(req.params.id))
    );
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to remove member" });
  }
});

export default router;
