import { Router } from "express";

const router = Router();

// GET /api/services
router.get("/", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 4" });
});

// POST /api/services
router.post("/", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 4" });
});

// GET /api/services/:id
router.get("/:id", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 4" });
});

// PATCH /api/services/:id
router.patch("/:id", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 4" });
});

// DELETE /api/services/:id
router.delete("/:id", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 4" });
});

export default router;
