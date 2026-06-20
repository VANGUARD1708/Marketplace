export interface RiskReport {
  userId: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  flags: string[];
  score: number;
}

export async function analyzeRisk(_userId: number): Promise<RiskReport> {
  throw new Error("Not implemented");
}
