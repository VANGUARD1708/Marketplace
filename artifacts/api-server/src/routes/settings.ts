import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });
router.patch("/", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });
router.patch("/password", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });
router.get("/linked-accounts", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });
router.post("/linked-accounts", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });
router.delete("/linked-accounts/:id", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });

export default router;
