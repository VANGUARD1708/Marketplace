import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const guardianAlertsTable =
  pgTable("guardian_alerts", {
    id: serial("id").primaryKey(),

    userId: integer("user_id"),

    severity: text("severity")
      .notNull(),

    title: text("title")
      .notNull(),

    message: text("message")
      .notNull(),

    action: text("action")
      .notNull(),

    createdAt: timestamp(
      "created_at",
    )
      .defaultNow()
      .notNull(),
  });

export type GuardianAlert =
  typeof guardianAlertsTable.$inferSelect;