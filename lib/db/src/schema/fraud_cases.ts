import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const fraudCasesTable =
  pgTable("fraud_cases", {
    id: serial("id").primaryKey(),

    userId: integer("user_id"),

    caseType: text(
      "case_type",
    ).notNull(),

    status: text(
      "status",
    ).notNull(),

    notes: text(
      "notes",
    ),

    createdAt: timestamp(
      "created_at",
    )
      .defaultNow()
      .notNull(),
  });

export type FraudCase =
  typeof fraudCasesTable.$inferSelect;