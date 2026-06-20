import { Router } from "express";

const router = Router();

type VerificationStatus =
  | "pending"
  | "approved"
  | "rejected";

type Verification = {
  id: number;
  userId: number;
  type: string;
  documentNumber: string;
  documentUrl: string;
  status: VerificationStatus;
  submittedAt: Date;
  reviewedAt: Date | null;
};

let verifications: Verification[] = [
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
 */
router.get("/", (_req, res) => {
  return res.json(verifications);
});

/**
 * GET /api/verification/:id
 */
router.get("/:id", (req, res) => {
  const verification = verifications.find(
    (v) => v.id === Number(req.params.id),
  );

  if (!verification) {
    return res.status(404).json({
      error: "Verification not found",
    });
  }

  return res.json(verification);
});

/**
 * POST /api/verification
 */
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

  const verification: Verification = {
    id: Date.now(),
    userId: Number(userId),
    type: String(type),
    documentNumber: documentNumber ?? "",
    documentUrl: documentUrl ?? "",
    status: "pending",
    submittedAt: new Date(),
    reviewedAt: null,
  };

  verifications.unshift(verification);

  return res.status(201).json(verification);
});

/**
 * PATCH /api/verification/:id/status
 */
router.patch("/:id/status", (req, res) => {
  const verification = verifications.find(
    (v) => v.id === Number(req.params.id),
  );

  if (!verification) {
    return res.status(404).json({
      error: "Verification not found",
    });
  }

  const status = req.body.status as VerificationStatus;

  if (
    status !== "pending" &&
    status !== "approved" &&
    status !== "rejected"
  ) {
    return res.status(400).json({
      error: "Invalid status",
    });
  }

  verification.status = status;
  verification.reviewedAt = new Date();

  return res.json({
    success: true,
    verification,
  });
});

export default router;