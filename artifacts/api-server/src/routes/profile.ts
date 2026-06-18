import { Router } from "express";

const router = Router();

// GET /api/profiles/:id
router.get("/:id", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 1" });
});

// PATCH /api/profiles/:id
router.patch("/:id", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 1" });
});

// GET /api/profiles/:id/followers
router.get("/:id/followers", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 1" });
});

// GET /api/profiles/:id/following
router.get("/:id/following", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 1" });
});

// POST /api/profiles/:id/follow
router.post("/:id/follow", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 1" });
});

// DELETE /api/profiles/:id/follow
router.delete("/:id/follow", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 1" });
});

export default router;
