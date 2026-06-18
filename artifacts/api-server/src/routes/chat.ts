import { Router } from "express";

const router = Router();

router.get("/conversations", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 3" }); });
router.post("/conversations", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 3" }); });
router.get("/conversations/:id", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 3" }); });
router.get("/conversations/:id/messages", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 3" }); });
router.post("/conversations/:id/messages", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 3" }); });

export default router;
