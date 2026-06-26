// api-server/src/ai/recommendationEngine.ts

export interface RecommendationInput {
  userId: number;

  interests?: string[];

  previousCategories?: string[];

  trustScore?: number;

  completedOrders?: number;
}

export interface RecommendationResult {
  score: number;

  recommendationType:
    | "listing"
    | "service"
    | "course"
    | "job";

  reason: string;
}

export function generateRecommendations(
  input: RecommendationInput,
): RecommendationResult[] {
  const recommendations: RecommendationResult[] =
    [];

  const categories =
    input.previousCategories ??
    [];

  for (const category of categories) {
    recommendations.push({
      score: 90,
      recommendationType:
        "listing",
      reason: `Recommended because of previous interest in ${category}`,
    });
  }

  if (
    (input.completedOrders ??
      0) > 10
  ) {
    recommendations.push({
      score: 85,
      recommendationType:
        "service",
      reason:
        "Based on transaction history",
    });
  }

  if (
    (input.trustScore ??
      0) >= 80
  ) {
    recommendations.push({
      score: 95,
      recommendationType:
        "job",
      reason:
        "High trust profile",
    });
  }

  recommendations.push({
    score: 80,
    recommendationType:
      "course",
    reason:
      "Suggested learning opportunity",
  });

  return recommendations.sort(
    (a, b) =>
      b.score - a.score,
  );
}