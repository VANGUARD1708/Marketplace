import {
  pgTable,
  serial,
  integer,
  numeric,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const riskAssessmentsTable =
  pgTable("risk_assessments", {
    id: serial("id").primaryKey(),

    userId: integer("user_id"),

    riskScore: numeric(
      "risk_score",
      {
        precision: 5,
        scale: 2,
      },
    ).notNull(),

    riskLevel: text(
      "risk_level",
    ).notNull(),

    recommendation: text(
      "recommendation",
    ).notNull(),

    createdAt: timestamp(
      "created_at",
    )
      .defaultNow()
      .notNull(),
  });

export type RiskAssessment =
  typeof riskAssessmentsTable.$inferSelect;