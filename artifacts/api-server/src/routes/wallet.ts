import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 5" }); });
router.post("/deposit", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 5" }); });
router.post("/withdraw", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 5" }); });
router.get("/transactions", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 5" }); });

export default router;
