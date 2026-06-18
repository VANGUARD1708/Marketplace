import { Router } from "express";

const router = Router();

// GET /api/feed
router.get("/", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 2" });
});

export default router;
