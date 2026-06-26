export interface FraudRuleResult {
  passed: boolean;
  riskPoints: number;
  reason: string;
}

export interface FraudCheckInput {
  verified: boolean;
  companyVerified?: boolean;
  disputes: number;
  transactionAmount: number;
  accountAgeDays?: number;
  completedEscrows?: number;
}

export const FRAUD_RULES = {
  HIGH_VALUE_TRANSACTION: 1000000,
  MAX_DISPUTES: 3,
  MIN_ACCOUNT_AGE_DAYS: 30,
  MIN_COMPLETED_ESCROWS: 3,
};

export function checkVerification(
  input: FraudCheckInput,
): FraudRuleResult {
  if (!input.verified) {
    return {
      passed: false,
      riskPoints: 30,
      reason:
        "User identity not verified",
    };
  }

  return {
    passed: true,
    riskPoints: 0,
    reason: "Verification passed",
  };
}

export function checkDisputes(
  input: FraudCheckInput,
): FraudRuleResult {
  if (
    input.disputes >=
    FRAUD_RULES.MAX_DISPUTES
  ) {
    return {
      passed: false,
      riskPoints: 25,
      reason:
        "Excessive disputes detected",
    };
  }

  return {
    passed: true,
    riskPoints: 0,
    reason: "Dispute check passed",
  };
}

export function checkTransactionAmount(
  input: FraudCheckInput,
): FraudRuleResult {
  if (
    input.transactionAmount >=
    FRAUD_RULES.HIGH_VALUE_TRANSACTION
  ) {
    return {
      passed: false,
      riskPoints: 20,
      reason:
        "High value transaction",
    };
  }

  return {
    passed: true,
    riskPoints: 0,
    reason:
      "Transaction amount normal",
  };
}

export function checkAccountAge(
  input: FraudCheckInput,
): FraudRuleResult {
  if (
    (input.accountAgeDays ?? 0) <
    FRAUD_RULES.MIN_ACCOUNT_AGE_DAYS
  ) {
    return {
      passed: false,
      riskPoints: 15,
      reason:
        "Account is too new",
    };
  }

  return {
    passed: true,
    riskPoints: 0,
    reason:
      "Account age acceptable",
    };
  }

export function checkEscrowHistory(
  input: FraudCheckInput,
): FraudRuleResult {
  if (
    (input.completedEscrows ?? 0) <
    FRAUD_RULES.MIN_COMPLETED_ESCROWS
  ) {
    return {
      passed: false,
      riskPoints: 10,
      reason:
        "Limited escrow history",
    };
  }

  return {
    passed: true,
    riskPoints: 0,
    reason:
      "Escrow history acceptable",
    };
  }

export function runFraudChecks(
  input: FraudCheckInput,
) {
  const checks = [
    checkVerification(input),
    checkDisputes(input),
    checkTransactionAmount(
      input,
    ),
    checkAccountAge(input),
    checkEscrowHistory(input),
  ];

  const totalRisk =
    checks.reduce(
      (sum, check) =>
        sum + check.riskPoints,
      0,
    );

  return {
    totalRisk,
    checks,
    flagged:
      totalRisk >= 50,
  };
}