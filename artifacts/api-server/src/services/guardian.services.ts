import { db } from "@workspace/db";

import {
  guardianAlertsTable,
  riskAssessmentsTable,
  fraudCasesTable,
  guardianActionsTable,
} from "@workspace/db";

import {
  generateAlert,
} from "../ai/alertEngine";

import {
  analyzeRisk,
} from "../ai/riskAnalyzer";

export class GuardianService {
  static async assessRisk(
    payload: {
      userId: number;

      verified: boolean;

      companyVerified: boolean;

      disputes: number;

      price: number;

      completedEscrows: number;

      accountAgeDays: number;
    },
  ) {
    const risk =
      analyzeRisk(
        payload,
      );

    await db
      .insert(
        riskAssessmentsTable,
      )
      .values({
        userId:
          payload.userId,

        riskScore:
          String(
            risk.riskScore,
          ),

        riskLevel:
          risk.riskLevel,

        recommendation:
          risk.recommendation,
      });

    return risk;
  }

  static async createAlert(
    payload: {
      userId?: number;

      riskScore: number;

      flags: string[];
    },
  ) {
    const alert =
      generateAlert(
        payload,
      );

    await db
      .insert(
        guardianAlertsTable,
      )
      .values({
        userId:
          payload.userId,

        severity:
          alert.severity,

        title:
          alert.title,

        message:
          alert.message,

        action:
          alert.action,
      });

    return alert;
  }

  static async createFraudCase(
    payload: {
      userId: number;

      caseType: string;

      notes?: string;
    },
  ) {
    const [fraudCase] =
      await db
        .insert(
          fraudCasesTable,
        )
        .values({
          userId:
            payload.userId,

          caseType:
            payload.caseType,

          status:
            "open",

          notes:
            payload.notes ??
            "",
        })
        .returning();

    return fraudCase;
  }

  static async logAction(
    payload: {
      userId: number;

      actionType: string;

      reason: string;

      performedBy?: number;
    },
  ) {
    const [action] =
      await db
        .insert(
          guardianActionsTable,
        )
        .values({
          userId:
            payload.userId,

          actionType:
            payload.actionType,

          reason:
            payload.reason,

          performedBy:
            payload.performedBy,
        })
        .returning();

    return action;
  }
}