import { Router } from "express";

import {
  runVanguardAssistant,
} from "../ai/vanguardAssistant";

import {
  calculateTrustScore,
} from "../ai/trustScore";

import {
  calculateReputation,
} from "../ai/reputationEngine";

import {
  generateRecommendations,
} from "../ai/recommendationEngine";

const router = Router();

/**
 * GET /api/vanguard-ai/health
 */
router.get(
  "/health",
  (_req, res) => {
    return res.json({
      success: true,
      service:
        "Vanguard AI",
      status: "online",
      timestamp:
        new Date().toISOString(),
    });
  },
);

/**
 * POST /api/vanguard-ai/analyze
 */
router.post(
  "/analyze",
  (req, res) => {
    try {
      const result =
        runVanguardAssistant(
          req.body,
        );

      return res.json({
        success: true,
        result,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          success: false,
          error:
            "Failed to analyze user",
        });
    }
  },
);

/**
 * POST /api/vanguard-ai/trust-score
 */
router.post(
  "/trust-score",
  (req, res) => {
    try {
      const result =
        calculateTrustScore(
          req.body,
        );

      return res.json({
        success: true,
        result,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          success: false,
          error:
            "Failed to calculate trust score",
        });
    }
  },
);

/**
 * POST /api/vanguard-ai/reputation
 */
router.post(
  "/reputation",
  (req, res) => {
    try {
      const result =
        calculateReputation(
          req.body,
        );

      return res.json({
        success: true,
        result,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          success: false,
          error:
            "Failed to calculate reputation",
        });
    }
  },
);

/**
 * POST /api/vanguard-ai/recommend
 */
router.post(
  "/recommend",
  (req, res) => {
    try {
      const result =
        generateRecommendations(
          req.body,
        );

      return res.json({
        success: true,
        result,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          success: false,
          error:
            "Failed to generate recommendations",
        });
    }
  },
);

export default router;