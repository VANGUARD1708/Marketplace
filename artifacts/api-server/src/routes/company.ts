import { Router } from "express";

const router = Router();

let companies = [
  {
    id: 1,
    ownerId: 1,
    name: "Vanguard Technologies",
    description: "Technology and digital commerce company.",
    industry: "Technology",
    verified: false,
    followers: 0,
    createdAt: new Date(),
  },
];

let companyMembers = [
  {
    companyId: 1,
    userId: 1,
    role: "Owner",
  },
];

/**
 * GET /api/companies
 /
router.get("/", (_req, res) => {
  res.json(companies);
});

/*
 * POST /api/companies
 /
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

  const company = {
    id: Date.now(),
    ownerId,
    name,
    description: description || "",
    industry: industry || "General",
    verified: false,
    followers: 0,
    createdAt: new Date(),
  };

  companies.unshift(company);

  companyMembers.push({
    companyId: company.id,
    userId: ownerId,
    role: "Owner",
  });

  res.status(201).json(company);
});

/*
 * GET /api/companies/:id
 /
router.get("/:id", (req, res) => {
  const company = companies.find(
    (c) => c.id === Number(req.params.id)
  );

  if (!company) {
    return res.status(404).json({
      error: "Company not found",
    });
  }

  res.json(company);
});

/*
 * PATCH /api/companies/:id
 /
router.patch("/:id", (req, res) => {
  const company = companies.find(
    (c) => c.id === Number(req.params.id)
  );

  if (!company) {
    return res.status(404).json({
      error: "Company not found",
    });
  }

  Object.assign(company, req.body);

  res.json(company);
});

/*
 * GET /api/companies/:id/members
 /
router.get("/:id/members", (req, res) => {
  const members = companyMembers.filter(
    (m) => m.companyId === Number(req.params.id)
  );

  res.json(members);
});

/*
 * POST /api/companies/:id/members
 */
router.post("/:id/members", (req, res) => {
  const { userId, role } = req.body;

  if (!userId) {
    return res.status(400).json({
      error: "userId required",
    });
  }

  const member = {
    companyId: Number(req.params.id),
    userId,
    role: role || "Member",
  };

  companyMembers.push(member);

  res.status(201).json(member);
});

export default router;