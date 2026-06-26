import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const guardianActionsTable =
  pgTable("guardian_actions", {
    id: serial("id").primaryKey(),

    userId: integer("user_id"),

    actionType: text(
      "action_type",
    ).notNull(),

    reason: text(
      "reason",
    ).notNull(),

    performedBy: integer(
      "performed_by",
    ),

    createdAt: timestamp(
      "created_at",
    )
      .defaultNow()
      .notNull(),
  });

export type GuardianAction =
  typeof guardianActionsTable.$inferSelect;