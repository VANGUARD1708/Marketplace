// api-server/src/ai/alertEngine.ts

export type AlertSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface AlertInput {
  userId?: number;
  listingId?: number;
  transactionId?: number;
  escrowId?: number;

  riskScore: number;

  flags: string[];
}

export interface AlertResult {
  severity: AlertSeverity;

  title: string;

  message: string;

  action:
    | "ignore"
    | "review"
    | "freeze"
    | "escalate";

  createdAt: Date;
}

export function generateAlert(
  input: AlertInput,
): AlertResult {
  let severity: AlertSeverity =
    "low";

  let action:
    | "ignore"
    | "review"
    | "freeze"
    | "escalate" =
    "ignore";

  if (input.riskScore >= 90) {
    severity =
      "critical";

    action =
      "freeze";
  } else if (
    input.riskScore >= 70
  ) {
    severity =
      "high";

    action =
      "escalate";
  } else if (
    input.riskScore >= 40
  ) {
    severity =
      "medium";

    action =
      "review";
  }

  const title =
    severity ===
    "critical"
      ? "Critical Risk Alert"
      : severity ===
        "high"
      ? "High Risk Alert"
      : severity ===
        "medium"
      ? "Risk Review Required"
      : "Low Risk Activity";

  const message =
    input.flags.length > 0
      ? input.flags.join(
          ", ",
        )
      : "No specific flags detected";

  return {
    severity,
    title,
    message,
    action,
    createdAt:
      new Date(),
  };
}

export function generateGuardianAlerts(
  riskScore: number,
  flags: string[],
) {
  return generateAlert({
    riskScore,
    flags,
  });
}

export function shouldNotifyAdmin(
  riskScore: number,
): boolean {
  return (
    riskScore >= 70
  );
}

export function shouldFreezeAccount(
  riskScore: number,
): boolean {
  return (
    riskScore >= 90
  );
}