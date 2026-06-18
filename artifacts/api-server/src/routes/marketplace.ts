import { Router } from "express";

const router = Router();

// GET /api/marketplace/listings
router.get("/listings", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 3" });
});

// POST /api/marketplace/listings
router.post("/listings", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 3" });
});

// GET /api/marketplace/listings/:id
router.get("/listings/:id", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 3" });
});

// PATCH /api/marketplace/listings/:id
router.patch("/listings/:id", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 3" });
});

// DELETE /api/marketplace/listings/:id
router.delete("/listings/:id", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 3" });
});

export default router;
