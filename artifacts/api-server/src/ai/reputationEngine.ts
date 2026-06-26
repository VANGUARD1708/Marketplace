// api-server/src/ai/reputationEngine.ts

import {
  calculateTrustScore,
} from "./trustScore";

import {
  analyzeReviews,
} from "./reviewAnalyzer";

import {
  analyzeCompany,
} from "./companyAnalyzer";

export interface ReputationInput {
  verified: boolean;
  companyVerified: boolean;
  completedEscrows: number;
  disputes: number;
  positiveReviews?: number;
  accountAgeDays?: number;

  averageRating: number;
  totalReviews: number;
  negativeReviews?: number;
  flaggedReviews?: number;

  yearsInOperation?: number;
  employeeCount?: number;
  completedOrders?: number;
  disputeCount?: number;
}

export interface ReputationResult {
  overallScore: number;

  reputation:
    | "poor"
    | "average"
    | "good"
    | "excellent";

  trustScore: number;

  reviewScore: number;

  companyScore: number;

  recommendation:
    | "review"
    | "trusted"
    | "verified";
}

export function calculateReputation(
  data: ReputationInput,
): ReputationResult {
  const trust =
    calculateTrustScore({
      verified:
        data.verified,
      companyVerified:
        data.companyVerified,
      completedEscrows:
        data.completedEscrows,
      disputes:
        data.disputes,
      positiveReviews:
        data.positiveReviews,
      accountAgeDays:
        data.accountAgeDays,
    });

  const reviews =
    analyzeReviews({
      averageRating:
        data.averageRating,
      totalReviews:
        data.totalReviews,
      negativeReviews:
        data.negativeReviews,
      flaggedReviews:
        data.flaggedReviews,
      accountAgeDays:
        data.accountAgeDays,
    });

  const company =
    analyzeCompany({
      verified:
        data.companyVerified,
      yearsInOperation:
        data.yearsInOperation,
      employeeCount:
        data.employeeCount,
      completedOrders:
        data.completedOrders,
      disputeCount:
        data.disputeCount,
      averageRating:
        data.averageRating,
    });

  const overallScore =
    Math.round(
      (
        trust.score +
        reviews.score +
        company.score
      ) / 3,
    );

  let reputation:
    | "poor"
    | "average"
    | "good"
    | "excellent" =
    "poor";

  let recommendation:
    | "review"
    | "trusted"
    | "verified" =
    "review";

  if (
    overallScore >= 80
  ) {
    reputation =
      "excellent";

    recommendation =
      "verified";
  } else if (
    overallScore >= 60
  ) {
    reputation =
      "good";

    recommendation =
      "trusted";
  } else if (
    overallScore >= 40
  ) {
    reputation =
      "average";
  }

  return {
    overallScore,
    reputation,
    trustScore:
      trust.score,
    reviewScore:
      reviews.score,
    companyScore:
      company.score,
    recommendation,
  };
}