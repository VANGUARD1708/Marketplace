import { db } from "@workspace/db";

import {
  usersTable,
  trustScoresTable,
} from "@workspace/db";

import {
  calculateTrustScore,
} from "../ai/trustScore";

export async function trustRecalculationJob() {
  console.log(
    "[Guardian AI] Trust Recalculation Started",
  );

  try {
    const users =
      await db.select().from(
        usersTable,
      );

    for (const user of users) {
      const trust =
        calculateTrustScore({
          verified:
            Boolean(
              user.isVerified,
            ),
          companyVerified:
            false,
          completedEscrows: 0,
          disputes: 0,
          positiveReviews: 0,
          accountAgeDays: 30,
        });

      await db
        .insert(
          trustScoresTable,
        )
        .values({
          userId:
            user.id,
          score:
            trust.score,
          level:
            trust.level,
        })
        .onConflictDoUpdate({
          target:
            trustScoresTable.userId,
          set: {
            score:
              trust.score,
            level:
              trust.level,
          },
        });
    }

    console.log(
      "[Guardian AI] Trust Recalculation Complete",
    );
  } catch (error) {
    console.error(
      "[Guardian AI] Trust Recalculation Failed",
      error,
    );
  }
}