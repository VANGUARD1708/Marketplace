import { Router } from "express";

const router = Router();

router.post("/chat", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 8" }); });
router.get("/recommendations", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 8" }); });
router.get("/search", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 8" }); });
router.get("/risk/:userId", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 8" }); });

export default router;
