import { Router } from "express";

const router = Router();

let verifications = [
  {
    id: 1,
    userId: 1,
    type: "identity",
    documentNumber: "ID123456",
    documentUrl: "/uploads/id-card.jpg",
    status: "pending",
    submittedAt: new Date(),
    reviewedAt: null,
  },
];

/**
 * GET /api/verification
 /
router.get("/", (_req, res) => {
  res.json(verifications);
});

/*
 * GET /api/verification/:id
 /
router.get("/:id", (req, res) => {
  const verification = verifications.find(
    (v) => v.id === Number(req.params.id)
  );

  if (!verification) {
    return res.status(404).json({
      error: "Verification not found",
    });
  }

  res.json(verification);
});

/*
 * POST /api/verification
 /
router.post("/", (req, res) => {
  const {
    userId,
    type,
    documentNumber,
    documentUrl,
  } = req.body;

  if (!userId || !type) {
    return res.status(400).json({
      error: "userId and type are required",
    });
  }

  const verification = {
    id: Date.now(),
    userId,
    type,
    documentNumber: documentNumber || "",
    documentUrl: documentUrl || "",
    status: "pending",
    submittedAt: new Date(),
    reviewedAt: null,
  };

  verifications.unshift(verification);

  res.status(201).json(verification);
});

/*
 * PATCH /api/verification/:id/status
 */
router.patch("/:id/status", (req, res) => {
  const verification = verifications.find(
    (v) => v.id === Number(req.params.id)
  );

  if (!verification) {
    return res.status(404).json({
      error: "Verification not found",
    });
  }

  const { status } = req.body;

  if (
    status !== "approved" &&
    status !== "rejected" &&
    status !== "pending"
  ) {
    return res.status(400).json({
      error: "Invalid status",
    });
  }

  verification.status = status;
  verification.reviewedAt = new Date();

  res.json({
    success: true,
    verification,
  });
});

export default router;