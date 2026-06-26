import {
  VanguardAiService,
} from "../services/vanguardAi.service";

export async function guardianScanJob() {
  console.log(
    "[Guardian AI] Scan Started",
  );

  try {
    /**
     * Later replace this
     * with real DB users.
     */
    const users = [
      {
        userId: 1,
        verified: true,
        companyVerified: false,
        disputes: 1,
        completedEscrows: 10,
        accountAgeDays: 120,
        price: 0,
      },
    ];

    for (const user of users) {
      await VanguardAiService.runGuardianScan(
        user,
      );
    }

    console.log(
      "[Guardian AI] Scan Complete",
    );
  } catch (error) {
    console.error(
      "[Guardian AI] Scan Failed",
      error,
    );
  }
}