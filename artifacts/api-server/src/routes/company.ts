import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 7" }); });
router.post("/", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 7" }); });
router.get("/:id", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 7" }); });
router.patch("/:id", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 7" }); });
router.get("/:id/members", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 7" }); });
router.post("/:id/members", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 7" }); });

export default router;
