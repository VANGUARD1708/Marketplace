import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const trustHistoryTable = pgTable(
  "trust_history",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    action: text("action").notNull(),
    scoreChange: integer("score_change").notNull(),
    createdAt: timestamp("created_at")
      .notNull()
      .defaultNow(),
  },
);

export const insertTrustHistorySchema =
  createInsertSchema(
    trustHistoryTable,
  ).omit({
    id: true,
    createdAt: true,
  });

export type InsertTrustHistory =
  z.infer<
    typeof insertTrustHistorySchema
  >;

export type TrustHistory =
  typeof trustHistoryTable.$inferSelect;