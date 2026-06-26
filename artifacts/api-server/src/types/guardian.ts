export type RiskLevel = "low" | "medium" | "high" | "critical";
export type GuardianDecision = "allow" | "review" | "block";

export interface GuardianAlert {
  id: number;
  entityType: "user" | "listing" | "transaction" | "message";
  entityId: number;
  alertType: string;
  riskLevel: RiskLevel;
  description: string;
  isResolved: boolean;
  resolvedById?: number;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface RiskAssessment {
  entityType: string;
  entityId: number;
  riskScore: number;
  riskLevel: RiskLevel;
  signals: RiskSignal[];
  decision: GuardianDecision;
  recommendation: string;
}

export interface RiskSignal {
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
  score: number;
}

export interface FraudCase {
  id: number;
  reportedById: number;
  suspectId: number;
  caseType: string;
  evidence: string;
  status: "open" | "investigating" | "resolved" | "dismissed";
  resolution?: string;
  createdAt: Date;
}
