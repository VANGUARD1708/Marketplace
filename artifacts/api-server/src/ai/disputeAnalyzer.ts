// api-server/src/ai/disputeAnalyzer.ts

export interface DisputeAnalysisInput {
  disputeCount: number;
  transactionAmount: number;
  buyerVerified: boolean;
  sellerVerified: boolean;
  buyerTrustScore?: number;
  sellerTrustScore?: number;
  resolutionTimeDays?: number;
}

export interface DisputeAnalysisResult {
  score: number;

  riskLevel:
    | "low"
    | "medium"
    | "high";

  recommendation:
    | "allow"
    | "review"
    | "block";

  flags: string[];
}

export function analyzeDispute(
  dispute: DisputeAnalysisInput,
): DisputeAnalysisResult {
  let score = 0;

  const flags: string[] = [];

  // Previous disputes
  if (
    dispute.disputeCount >= 3
  ) {
    score += 25;

    flags.push(
      "Frequent disputes detected",
    );
  }

  // Buyer verification
  if (
    !dispute.buyerVerified
  ) {
    score += 15;

    flags.push(
      "Buyer not verified",
    );
  }

  // Seller verification
  if (
    !dispute.sellerVerified
  ) {
    score += 15;

    flags.push(
      "Seller not verified",
    );
  }

  // Buyer trust score
  if (
    (dispute.buyerTrustScore ??
      0) < 40
  ) {
    score += 15;

    flags.push(
      "Low buyer trust score",
    );
  }

  // Seller trust score
  if (
    (dispute.sellerTrustScore ??
      0) < 40
  ) {
    score += 15;

    flags.push(
      "Low seller trust score",
    );
  }

  // High-value transaction
  if (
    dispute.transactionAmount >=
    1000000
  ) {
    score += 20;

    flags.push(
      "High-value dispute",
    );
  }

  // Long resolution time
  if (
    (dispute.resolutionTimeDays ??
      0) > 14
  ) {
    score += 10;

    flags.push(
      "Dispute unresolved too long",
    );
  }

  let riskLevel:
    | "low"
    | "medium"
    | "high" = "low";

  let recommendation:
    | "allow"
    | "review"
    | "block" = "allow";

  if (score >= 70) {
    riskLevel = "high";
    recommendation =
      "block";
  } else if (
    score >= 40
  ) {
    riskLevel =
      "medium";
    recommendation =
      "review";
  }

  return {
    score,
    riskLevel,
    recommendation,
    flags,
  };
}