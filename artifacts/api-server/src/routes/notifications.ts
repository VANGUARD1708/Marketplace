import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });
router.patch("/:id/read", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });
router.post("/read-all", (_req, res) => { res.status(501).json({ error: "Not implemented" }); });

export default router;
