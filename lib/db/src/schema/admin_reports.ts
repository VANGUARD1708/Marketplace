import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const adminReportsTable = pgTable("admin_reports", {
  id: serial("id").primaryKey(),
  reporterId: integer("reporter_id").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("open"),
  resolvedById: integer("resolved_by_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const insertAdminReportSchema = createInsertSchema(adminReportsTable).omit({ id: true, createdAt: true });
export type InsertAdminReport = z.infer<typeof insertAdminReportSchema>;
export type AdminReport = typeof adminReportsTable.$inferSelect;
