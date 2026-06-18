import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 4" }); });
router.post("/", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 4" }); });
router.get("/:id", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 4" }); });
router.patch("/:id", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 4" }); });
router.delete("/:id", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 4" }); });
router.post("/:id/enroll", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 4" }); });
router.get("/:id/lessons", (_req, res) => { res.status(501).json({ error: "Not implemented — Phase 4" }); });

export default router;
