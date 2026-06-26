// api-server/src/ai/trustScore.ts

export interface TrustScoreInput {
  verified: boolean;
  companyVerified: boolean;
  completedEscrows: number;
  disputes: number;
  positiveReviews?: number;
  accountAgeDays?: number;
}

export interface TrustScoreResult {
  score: number;

  level:
    | "New"
    | "Moderate"
    | "Trusted"
    | "Elite";

  badges: string[];
}

export function calculateTrustScore(
  data: TrustScoreInput,
): TrustScoreResult {
  let score = 0;

  const badges: string[] = [];

  // Identity Verification
  if (data.verified) {
    score += 20;

    badges.push(
      "Verified User",
    );
  }

  // Company Verification
  if (
    data.companyVerified
  ) {
    score += 20;

    badges.push(
      "Verified Company",
    );
  }

  // Completed Escrows
  score += Math.min(
    data.completedEscrows * 2,
    30,
  );

  if (
    data.completedEscrows >=
    20
  ) {
    badges.push(
      "Trusted Seller",
    );
  }

  // Positive Reviews
  score += Math.min(
    data.positiveReviews ??
      0,
    20,
  );

  if (
    (data.positiveReviews ??
      0) >= 10
  ) {
    badges.push(
      "Top Rated",
    );
  }

  // Account Age
  score += Math.min(
    Math.floor(
      (data.accountAgeDays ??
        0) / 30,
    ),
    10,
  );

  // Disputes
  score -=
    data.disputes * 5;

  score = Math.max(
    0,
    Math.min(100, score),
  );

  let level:
    | "New"
    | "Moderate"
    | "Trusted"
    | "Elite" = "New";

  if (score >= 80) {
    level = "Elite";

    badges.push(
      "Guardian Protected",
    );
  } else if (
    score >= 60
  ) {
    level =
      "Trusted";
  } else if (
    score >= 30
  ) {
    level =
      "Moderate";
  }

  return {
    score,
    level,
    badges,
  };
}