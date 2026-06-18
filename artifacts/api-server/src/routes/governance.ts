import { Router } from "express";

const router = Router();

router.get("/suggestions", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 9" }); });
router.post("/suggestions", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 9" }); });
router.get("/suggestions/:id", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 9" }); });
router.patch("/suggestions/:id/review", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 9" }); });
router.get("/decisions", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 9" }); });

export default router;
