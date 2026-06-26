import {
  GuardianService,
} from "../services/guardian.service";

export async function fraudMonitoringJob() {
  console.log(
    "[Guardian AI] Fraud Monitor Started",
  );

  try {
    const suspiciousUsers = [
      {
        userId: 1,
        riskScore: 95,
      },
    ];

    for (const user of suspiciousUsers) {
      if (
        user.riskScore >= 90
      ) {
        await GuardianService.createFraudCase(
          {
            userId:
              user.userId,
            caseType:
              "critical_risk",
            notes:
              "Automatically detected by Guardian AI",
          },
        );
      }
    }

    console.log(
      "[Guardian AI] Fraud Monitor Complete",
    );
  } catch (error) {
    console.error(
      "[Guardian AI] Fraud Monitor Failed",
      error,
    );
  }
}