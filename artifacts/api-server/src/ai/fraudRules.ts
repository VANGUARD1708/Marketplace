export interface FraudSignal {
  rule: string;
  severity: "low" | "medium" | "high";
  triggered: boolean;
}

export async function evaluateFraudRules(_payload: unknown): Promise<FraudSignal[]> {
  throw new Error("Not implemented");
}
