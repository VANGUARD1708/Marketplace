import { Router } from "express";

const router = Router();

router.get("/drivers/:id", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 10" }); });
router.get("/tracking/:orderId", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 10" }); });
router.get("/history/:driverId", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 10" }); });

export default router;
