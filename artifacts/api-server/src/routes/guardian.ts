import { Router } from "express";
import { analyzeUser } from "../ai/guardian";

const router = Router();

/**
 * GET /api/guardian/health
 */
router.get("/health", (_req, res) => {
  return res.json({
    success: true,
    service: "Guardian AI",
    status: "online",
  });
});

/**
 * POST /api/guardian/user
 */
router.post("/user", (req, res) => {
  const result = analyzeUser(req.body);

  return res.json(result);
});

export default router;