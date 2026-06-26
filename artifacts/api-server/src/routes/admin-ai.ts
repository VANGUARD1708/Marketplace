import { Router } from "express";
import { db } from "@workspace/db";

import {
  guardianAlertsTable,
  fraudCasesTable,
  riskAssessmentsTable,
  guardianActionsTable,
} from "@workspace/db";

const router = Router();

/**
 * GET /api/admin-ai/alerts
 */
router.get(
  "/alerts",
  async (_req, res) => {
    try {
      const alerts =
        await db
          .select()
          .from(
            guardianAlertsTable,
          );

      return res.json(
        alerts,
      );
    } catch (error) {
      console.error(
        error,
      );

      return res
        .status(500)
        .json({
          error:
            "Failed to load alerts",
        });
    }
  },
);

/**
 * GET /api/admin-ai/fraud-cases
 */
router.get(
  "/fraud-cases",
  async (_req, res) => {
    try {
      const cases =
        await db
          .select()
          .from(
            fraudCasesTable,
          );

      return res.json(
        cases,
      );
    } catch (error) {
      console.error(
        error,
      );

      return res
        .status(500)
        .json({
          error:
            "Failed to load fraud cases",
        });
    }
  },
);

/**
 * GET /api/admin-ai/risk-assessments
 */
router.get(
  "/risk-assessments",
  async (_req, res) => {
    try {
      const assessments =
        await db
          .select()
          .from(
            riskAssessmentsTable,
          );

      return res.json(
        assessments,
      );
    } catch (error) {
      console.error(
        error,
      );

      return res
        .status(500)
        .json({
          error:
            "Failed to load risk assessments",
        });
    }
  },
);

/**
 * GET /api/admin-ai/actions
 */
router.get(
  "/actions",
  async (_req, res) => {
    try {
      const actions =
        await db
          .select()
          .from(
            guardianActionsTable,
          );

      return res.json(
        actions,
      );
    } catch (error) {
      console.error(
        error,
      );

      return res
        .status(500)
        .json({
          error:
            "Failed to load actions",
        });
    }
  },
);

export default router;