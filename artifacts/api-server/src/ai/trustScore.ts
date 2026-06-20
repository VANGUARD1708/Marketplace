export function calculateTrustScore(data: {
  verified: boolean;
  companyVerified: boolean;
  completedEscrows: number;
  disputes: number;
}) {
  let score = 0;

  if (data.verified) score += 20;
  if (data.companyVerified) score += 20;

  score += Math.min(
    data.completedEscrows * 2,
    40,
  );

  score -= data.disputes * 5;

  score = Math.max(0, score);

  return {
    score,
    level:
      score >= 80
        ? "Trusted"
        : score >= 50
        ? "Moderate"
        : "Risky",
  };
}