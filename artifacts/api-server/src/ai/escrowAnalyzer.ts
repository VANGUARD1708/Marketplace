// api-server/src/ai/escrowAnalyzer.ts

export interface EscrowAnalysisInput {
  amount: number;
  buyerVerified: boolean;
  sellerVerified: boolean;
  buyerTrustScore?: number;
  sellerTrustScore?: number;
  disputeCount?: number;
  escrowAgeDays?: number;
}

export interface EscrowAnalysisResult {
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

export function analyzeEscrow(
  escrow: EscrowAnalysisInput,
): EscrowAnalysisResult {
  let score = 0;

  const flags: string[] = [];

  // Buyer Verification
  if (!escrow.buyerVerified) {
    score += 20;

    flags.push(
      "Buyer not verified",
    );
  }

  // Seller Verification
  if (!escrow.sellerVerified) {
    score += 20;

    flags.push(
      "Seller not verified",
    );
  }

  // Buyer Trust Score
  if (
    (escrow.buyerTrustScore ?? 0) <
    40
  ) {
    score += 15;

    flags.push(
      "Low buyer trust score",
    );
  }

  // Seller Trust Score
  if (
    (escrow.sellerTrustScore ?? 0) <
    40
  ) {
    score += 15;

    flags.push(
      "Low seller trust score",
    );
  }

  // Escrow Amount
  if (
    escrow.amount >=
    1000000
  ) {
    score += 20;

    flags.push(
      "High-value escrow",
    );
  }

  // Disputes
  if (
    (escrow.disputeCount ?? 0) >=
    3
  ) {
    score += 25;

    flags.push(
      "Multiple disputes detected",
    );
  }

  // Escrow Age
  if (
    (escrow.escrowAgeDays ?? 0) >
    30
  ) {
    score += 10;

    flags.push(
      "Escrow active too long",
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