export function analyzeRisk(data: {
  verified: boolean;
  disputes: number;
  price: number;
}) {
  let riskScore = 0;

  if (!data.verified) {
    riskScore += 30;
  }

  if (data.disputes > 2) {
    riskScore += 30;
  }

  if (data.price > 500000) {
    riskScore += 20;
  }

  return {
    riskScore,
    riskLevel:
      riskScore >= 70
        ? "high"
        : riskScore >= 40
        ? "medium"
        : "low",
    recommendation:
      riskScore >= 70
        ? "review"
        : "allow",
  };
}