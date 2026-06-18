import { Router } from "express";

const router = Router();

router.get("/users", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });
router.get("/listings", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });
router.get("/reports", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });
router.patch("/reports/:id", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });
router.get("/verification-requests", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });
router.patch("/verification-requests/:id", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });
router.get("/escrow-cases", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });
router.get("/disputes", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });
router.patch("/disputes/:id", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });

export default router;
