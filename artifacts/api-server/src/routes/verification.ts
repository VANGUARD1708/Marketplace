import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 6" }); });
router.post("/", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 6" }); });
router.get("/:id", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 6" }); });
router.patch("/:id/status", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 6" }); });

export default router;
