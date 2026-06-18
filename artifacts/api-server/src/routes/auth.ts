import { Router } from "express";

const router = Router();

// POST /api/auth/register
router.post("/register", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 1" });
});

// POST /api/auth/login
router.post("/login", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 1" });
});

// POST /api/auth/logout
router.post("/logout", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 1" });
});

// GET /api/auth/me
router.get("/me", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 1" });
});

// POST /api/auth/refresh
router.post("/refresh", (_req, res) => {
  res.status(501).json({ error: "Not implemented — Phase 1" });
});

export default router;
