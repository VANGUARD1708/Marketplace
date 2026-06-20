import { calculateTrustScore } from "./trustScore";
import { analyzeRisk } from "./riskAnalyzer";

export interface GuardianUserInput {
  verified: boolean;
  companyVerified: boolean;
  completedEscrows: number;
  disputes: number;
  listingPrice: number;
}

export interface GuardianResult {
  trust: {
    score: number;
    level: string;
  };
  risk: {
    riskScore: number;
    riskLevel: string;
    recommendation: string;
  };
  guardianDecision:
    | "allow"
    | "review"
    | "block";
}

export function analyzeUser(
  data: GuardianUserInput,
): GuardianResult {
  const trust =
    calculateTrustScore({
      verified: data.verified,
      companyVerified:
        data.companyVerified,
      completedEscrows:
        data.completedEscrows,
      disputes: data.disputes,
    });

  const risk = analyzeRisk({
    verified: data.verified,
    disputes: data.disputes,
    price: data.listingPrice,
  });

  let guardianDecision:
    | "allow"
    | "review"
    | "block" = "allow";

  if (risk.riskScore >= 80) {
    guardianDecision = "block";
  } else if (
    risk.riskScore >= 50
  ) {
    guardianDecision = "review";
  }

  return {
    trust,
    risk,
    guardianDecision,
  };
}

export function analyzeListing(
  listing: {
    price: number;
    sellerVerified: boolean;
  },
) {
  let riskScore = 0;

  if (
    !listing.sellerVerified
  ) {
    riskScore += 30;
  }

  if (
    listing.price > 500000
  ) {
    riskScore += 20;
  }

  return {
    riskScore,
    recommendation:
      riskScore >= 50
        ? "review"
        : "allow",
  };
}

export function analyzeTransaction(
  transaction: {
    amount: number;
    buyerVerified: boolean;
    sellerVerified: boolean;
  },
) {
  let riskScore = 0;

  if (
    !transaction.buyerVerified
  ) {
    riskScore += 25;
  }

  if (
    !transaction.sellerVerified
  ) {
    riskScore += 25;
  }

  if (
    transaction.amount >
    1000000
  ) {
    riskScore += 30;
  }

  return {
    riskScore,
    recommendation:
      riskScore >= 60
        ? "review"
        : "allow",
  };
}