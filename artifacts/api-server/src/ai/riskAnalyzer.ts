export interface RiskAnalysisInput {
  verified: boolean;
  companyVerified?: boolean;
  disputes: number;
  price: number;
  completedEscrows?: number;
  accountAgeDays?: number;
}

export interface RiskAnalysisResult {
  riskScore: number;
  riskLevel:
    | "low"
    | "medium"
    | "high";
  recommendation:
    | "allow"
    | "review"
    | "block";
  reasons: string[];
}

export function analyzeRisk(
  data: RiskAnalysisInput,
): RiskAnalysisResult {
  let riskScore = 0;

  const reasons: string[] = [];

  if (!data.verified) {
    riskScore += 30;

    reasons.push(
      "User is not verified",
    );
  }

  if (
    !data.companyVerified
  ) {
    riskScore += 10;

    reasons.push(
      "Company not verified",
    );
  }

  if (data.disputes >= 3) {
    riskScore += 30;

    reasons.push(
      "Multiple disputes found",
    );
  }

  if (
    data.price >= 500000
  ) {
    riskScore += 15;

    reasons.push(
      "High value transaction",
    );
  }

  if (
    (data.completedEscrows ?? 0) <
    3
  ) {
    riskScore += 10;

    reasons.push(
      "Limited escrow history",
    );
  }

  if (
    (data.accountAgeDays ?? 0) <
    30
  ) {
    riskScore += 15;

    reasons.push(
      "New account",
    );
  }

  riskScore = Math.min(
    riskScore,
    100,
  );

  let riskLevel:
    | "low"
    | "medium"
    | "high" = "low";

  let recommendation:
    | "allow"
    | "review"
    | "block" = "allow";

  if (riskScore >= 70) {
    riskLevel = "high";
    recommendation =
      "block";
  } else if (
    riskScore >= 40
  ) {
    riskLevel =
      "medium";
    recommendation =
      "review";
  }

  return {
    riskScore,
    riskLevel,
    recommendation,
    reasons,
  };
}