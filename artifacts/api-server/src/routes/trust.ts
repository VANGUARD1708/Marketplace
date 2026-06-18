import { Router } from "express";

const router = Router();

// GET /api/trust/:userId
router.get("/:userId", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 1" });
});

// GET /api/trust/:userId/history
router.get("/:userId/history", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 1" });
});

export default router;
