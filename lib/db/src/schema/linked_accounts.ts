import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const linkedAccountsTable = pgTable("linked_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLinkedAccountSchema = createInsertSchema(linkedAccountsTable).omit({ id: true, createdAt: true });
export type InsertLinkedAccount = z.infer<typeof insertLinkedAccountSchema>;
export type LinkedAccount = typeof linkedAccountsTable.$inferSelect;
