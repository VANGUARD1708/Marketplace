import {
  calculateTrustScore,
  type TrustScoreInput,
} from "./trustScore";

import {
  analyzeRisk,
  type RiskAnalysisInput,
} from "./riskAnalyzer";

import {
  runFraudChecks,
  type FraudCheckInput,
} from "./fraudRules";

export interface GuardianInput
  extends TrustScoreInput,
    RiskAnalysisInput,
    FraudCheckInput {}

export interface GuardianResult {
  trust: ReturnType<
    typeof calculateTrustScore
  >;

  risk: ReturnType<
    typeof analyzeRisk
  >;

  fraud: ReturnType<
    typeof runFraudChecks
  >;

  guardianDecision:
    | "allow"
    | "review"
    | "block";

  summary: string[];
}

export function analyzeGuardian(
  input: GuardianInput,
): GuardianResult {
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
      price:
        input.price,
      completedEscrows:
        input.completedEscrows,
      accountAgeDays:
        input.accountAgeDays,
    });

  const fraud =
    runFraudChecks({
      verified:
        input.verified,
      companyVerified:
        input.companyVerified,
      disputes:
        input.disputes,
      transactionAmount:
        input.transactionAmount,
      accountAgeDays:
        input.accountAgeDays,
      completedEscrows:
        input.completedEscrows,
    });

  let guardianDecision:
    | "allow"
    | "review"
    | "block" =
    "allow";

  if (
    fraud.flagged ||
    risk.riskScore >= 70
  ) {
    guardianDecision =
      "block";
  } else if (
    risk.riskScore >= 40
  ) {
    guardianDecision =
      "review";
  }

  const summary: string[] =
    [];

  summary.push(
    `Trust Score: ${trust.score}`,
  );

  summary.push(
    `Risk Score: ${risk.riskScore}`,
  );

  if (
    fraud.flagged
  ) {
    summary.push(
      "Fraud indicators detected",
    );
  }

  return {
    trust,
    risk,
    fraud,
    guardianDecision,
    summary,
  };
}

export function analyzeListing(
  input: {
    title: string;
    price: number;
    sellerVerified: boolean;
  },
) {
  let score = 0;

  const reasons: string[] =
    [];

  if (
    !input.sellerVerified
  ) {
    score += 30;

    reasons.push(
      "Seller not verified",
    );
  }

  if (
    input.price >
    1000000
  ) {
    score += 20;

    reasons.push(
      "High value listing",
    );
  }

  return {
    score,
    reasons,
    recommendation:
      score >= 50
        ? "review"
        : "allow",
  };
}

export function analyzeEscrow(
  amount: number,
) {
  let risk = 0;

  if (
    amount > 1000000
  ) {
    risk += 25;
  }

  return {
    risk,
    recommendation:
      risk > 20
        ? "review"
        : "allow",
  };
}

export function analyzeTransaction(
  amount: number,
) {
  let risk = 0;

  if (
    amount > 500000
  ) {
    risk += 20;
  }

  return {
    risk,
    recommendation:
      risk > 10
        ? "review"
        : "allow",
  };
}