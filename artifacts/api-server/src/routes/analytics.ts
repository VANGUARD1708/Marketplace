import { Router } from "express";

const router = Router();

router.get("/overview", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });
router.get("/users", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });
router.get("/listings", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });
router.get("/transactions", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });

export default router;
