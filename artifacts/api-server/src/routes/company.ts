import { Router } from "express";

const router = Router();

type Company = {
  id: number;
  ownerId: number;
  name: string;
  description: string;
  industry: string;
  verified: boolean;
  followers: number;
  createdAt: Date;
};

type CompanyMember = {
  companyId: number;
  userId: number;
  role: string;
};

let companies: Company[] = [
  {
    id: 1,
    ownerId: 1,
    name: "Vanguard Technologies",
    description:
      "Technology and digital commerce company.",
    industry: "Technology",
    verified: false,
    followers: 0,
    createdAt: new Date(),
  },
];

let companyMembers: CompanyMember[] = [
  {
    companyId: 1,
    userId: 1,
    role: "Owner",
  },
];

/**
 * GET /api/companies
 */
router.get("/", (_req, res) => {
  return res.json(companies);
});

/**
 * POST /api/companies
 */
router.post("/", (req, res) => {
  const {
    ownerId,
    name,
    description,
    industry,
  } = req.body;

  if (!ownerId || !name) {
    return res.status(400).json({
      error: "ownerId and name are required",
    });
  }

  const company: Company = {
    id: Date.now(),
    ownerId: Number(ownerId),
    name: String(name),
    description: description ?? "",
    industry: industry ?? "General",
    verified: false,
    followers: 0,
    createdAt: new Date(),
  };

  companies.unshift(company);

  companyMembers.push({
    companyId: company.id,
    userId: company.ownerId,
    role: "Owner",
  });

  return res.status(201).json(company);
});

/**
 * GET /api/companies/:id
 */
router.get("/:id", (req, res) => {
  const company = companies.find(
    (c) => c.id === Number(req.params.id),
  );

  if (!company) {
    return res.status(404).json({
      error: "Company not found",
    });
  }

  return res.json(company);
});

/**
 * PATCH /api/companies/:id
 */
router.patch("/:id", (req, res) => {
  const company = companies.find(
    (c) => c.id === Number(req.params.id),
  );

  if (!company) {
    return res.status(404).json({
      error: "Company not found",
    });
  }

  if (req.body.name !== undefined) {
    company.name = String(req.body.name);
  }

  if (req.body.description !== undefined) {
    company.description = String(
      req.body.description,
    );
  }

  if (req.body.industry !== undefined) {
    company.industry = String(
      req.body.industry,
    );
  }

  return res.json(company);
});

/**
 * GET /api/companies/:id/members
 */
router.get("/:id/members", (req, res) => {
  const members = companyMembers.filter(
    (m) =>
      m.companyId === Number(req.params.id),
  );

  return res.json(members);
});

/**
 * POST /api/companies/:id/members
 */
router.post("/:id/members", (req, res) => {
  const { userId, role } = req.body;

  if (!userId) {
    return res.status(400).json({
      error: "userId required",
    });
  }

  const member: CompanyMember = {
    companyId: Number(req.params.id),
    userId: Number(userId),
    role: role ?? "Member",
  };

  companyMembers.push(member);

  return res.status(201).json(member);
});

export default router;