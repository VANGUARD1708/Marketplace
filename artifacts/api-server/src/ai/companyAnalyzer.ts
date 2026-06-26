// api-server/src/ai/companyAnalyzer.ts

export interface CompanyAnalysisInput {
  verified: boolean;
  yearsInOperation?: number;
  employeeCount?: number;
  completedOrders?: number;
  disputeCount?: number;
  averageRating?: number;
}

export interface CompanyAnalysisResult {
  score: number;

  trustLevel:
    | "low"
    | "medium"
    | "high";

  recommendation:
    | "review"
    | "trusted"
    | "verified";

  flags: string[];
}

export function analyzeCompany(
  company: CompanyAnalysisInput,
): CompanyAnalysisResult {
  let score = 0;

  const flags: string[] = [];

  // Verification
  if (company.verified) {
    score += 30;
  } else {
    flags.push(
      "Company not verified",
    );
  }

  // Business age
  if (
    (company.yearsInOperation ??
      0) >= 3
  ) {
    score += 20;
  }

  // Employees
  if (
    (company.employeeCount ??
      0) >= 5
  ) {
    score += 10;
  }

  // Completed orders
  if (
    (company.completedOrders ??
      0) >= 50
  ) {
    score += 20;
  }

  // Rating
  if (
    (company.averageRating ??
      0) >= 4.5
  ) {
    score += 15;
  }

  // Disputes
  if (
    (company.disputeCount ??
      0) >= 3
  ) {
    score -= 20;

    flags.push(
      "Multiple disputes recorded",
    );
  }

  score = Math.max(
    0,
    Math.min(100, score),
  );

  let trustLevel:
    | "low"
    | "medium"
    | "high" = "low";

  let recommendation:
    | "review"
    | "trusted"
    | "verified" =
    "review";

  if (score >= 80) {
    trustLevel = "high";
    recommendation =
      "verified";
  } else if (
    score >= 50
  ) {
    trustLevel =
      "medium";
    recommendation =
      "trusted";
  }

  return {
    score,
    trustLevel,
    recommendation,
    flags,
  };
}