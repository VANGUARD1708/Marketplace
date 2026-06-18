import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 5" }); });
router.post("/", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 5" }); });
router.get("/:id", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 5" }); });
router.post("/:id/release", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 5" }); });
router.post("/:id/dispute", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 5" }); });

export default router;
