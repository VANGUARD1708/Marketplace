import { Router } from "express";

const router = Router();

// GET /api/jobs
router.get("/", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 4" });
});

// POST /api/jobs
router.post("/", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 4" });
});

// GET /api/jobs/:id
router.get("/:id", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 4" });
});

// PATCH /api/jobs/:id
router.patch("/:id", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 4" });
});

// DELETE /api/jobs/:id
router.delete("/:id", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 4" });
});

// POST /api/jobs/:id/apply
router.post("/:id/apply", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 4" });
});

// GET /api/jobs/:id/applications
router.get("/:id/applications", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 4" });
});

export default router;
