// api-server/src/ai/vanguardAssistant.ts

import {
  calculateTrustScore,
} from "./trustScore";

import {
  analyzeRisk,
} from "./riskAnalyzer";

import {
  calculateReputation,
} from "./reputationEngine";

import {
  generateRecommendations,
} from "./recommendationEngine";

export interface VanguardAssistantInput {
  userId: number;

  verified: boolean;
  companyVerified: boolean;

  completedEscrows: number;
  disputes: number;

  positiveReviews?: number;
  averageRating?: number;
  totalReviews?: number;

  accountAgeDays?: number;

  interests?: string[];
  previousCategories?: string[];
}

export interface VanguardAssistantResult {
  trustScore: number;

  trustLevel: string;

  reputationScore: number;

  riskLevel: string;

  recommendations: string[];

  summary: string;
}

export function runVanguardAssistant(
  input: VanguardAssistantInput,
): VanguardAssistantResult {
  const trust =
    calculateTrustScore({
      verified:
        input.verified,
      companyVerified:
        input.companyVerified,
      completedEscrows:
        input.completedEscrows,
      disputes:
        input.disputes,
      positiveReviews:
        input.positiveReviews,
      accountAgeDays:
        input.accountAgeDays,
    });

  const risk =
    analyzeRisk({
      verified:
        input.verified,
      companyVerified:
        input.companyVerified,
      disputes:
        input.disputes,
      price: 0,
      completedEscrows:
        input.completedEscrows,
      accountAgeDays:
        input.accountAgeDays,
    });

  const reputation =
    calculateReputation({
      verified:
        input.verified,
      companyVerified:
        input.companyVerified,
      completedEscrows:
        input.completedEscrows,
      disputes:
        input.disputes,

      positiveReviews:
        input.positiveReviews,

      accountAgeDays:
        input.accountAgeDays,

      averageRating:
        input.averageRating ??
        0,

      totalReviews:
        input.totalReviews ??
        0,
    });

  const recommendations =
    generateRecommendations({
      userId:
        input.userId,
      interests:
        input.interests,
      previousCategories:
        input.previousCategories,
      trustScore:
        trust.score,
      completedOrders:
        input.completedEscrows,
    });

  return {
    trustScore:
      trust.score,

    trustLevel:
      trust.level,

    reputationScore:
      reputation.overallScore,

    riskLevel:
      risk.riskLevel,

    recommendations:
      recommendations.map(
        (r) => r.reason,
      ),

    summary:
      `Trust Score ${trust.score}, Reputation ${reputation.overallScore}, Risk ${risk.riskLevel}`,
  };
}