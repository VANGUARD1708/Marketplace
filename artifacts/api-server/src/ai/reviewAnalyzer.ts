// api-server/src/ai/reviewAnalyzer.ts

export interface ReviewAnalysisInput {
  averageRating: number;
  totalReviews: number;
  negativeReviews?: number;
  flaggedReviews?: number;
  accountAgeDays?: number;
}

export interface ReviewAnalysisResult {
  score: number;

  reputation:
    | "poor"
    | "average"
    | "good"
    | "excellent";

  recommendation:
    | "review"
    | "trusted"
    | "verified";

  flags: string[];
}

export function analyzeReviews(
  reviews: ReviewAnalysisInput,
): ReviewAnalysisResult {
  let score = 0;

  const flags: string[] = [];

  // Average Rating
  if (
    reviews.averageRating >= 4.5
  ) {
    score += 40;
  } else if (
    reviews.averageRating >= 4
  ) {
    score += 30;
  } else if (
    reviews.averageRating >= 3
  ) {
    score += 15;
  } else {
    flags.push(
      "Low average rating",
    );
  }

  // Review Volume
  if (
    reviews.totalReviews >= 100
  ) {
    score += 25;
  } else if (
    reviews.totalReviews >= 25
  ) {
    score += 15;
  } else if (
    reviews.totalReviews >= 5
  ) {
    score += 5;
  }

  // Negative Reviews
  if (
    (reviews.negativeReviews ??
      0) >= 10
  ) {
    score -= 20;

    flags.push(
      "High number of negative reviews",
    );
  }

  // Flagged Reviews
  if (
    (reviews.flaggedReviews ??
      0) >= 5
  ) {
    score -= 25;

    flags.push(
      "Suspicious review activity",
    );
  }

  // Account Age
  if (
    (reviews.accountAgeDays ??
      0) >= 365
  ) {
    score += 10;
  }

  score = Math.max(
    0,
    Math.min(100, score),
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

  if (score >= 80) {
    reputation =
      "excellent";

    recommendation =
      "verified";
  } else if (
    score >= 50
  ) {
    reputation =
      "good";

    recommendation =
      "trusted";
  } else if (
    score >= 30
  ) {
    reputation =
      "average";
  }

  return {
    score,
    reputation,
    recommendation,
    flags,
  };
}