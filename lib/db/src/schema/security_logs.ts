import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const securityLogsTable = pgTable(
  "security_logs",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id"),

    adminId: integer("admin_id"),

    roleId: integer("role_id"),

    action: text("action").notNull(),

    module: text("module").notNull(),

    targetId: text("target_id"),

    description: text("description"),

    severity: text("severity")
      .notNull()
      .default("info"),

    ipAddress: text("ip_address"),

    deviceId: text("device_id"),

    country: text("country"),

    city: text("city"),

    metadata: jsonb("metadata"),

    successful: boolean("successful")
      .notNull()
      .default(true),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index("security_logs_user_idx").on(
      table.userId,
    ),

    adminIdx: index("security_logs_admin_idx").on(
      table.adminId,
    ),

    moduleIdx: index("security_logs_module_idx").on(
      table.module,
    ),

    severityIdx: index("security_logs_severity_idx").on(
      table.severity,
    ),

    createdIdx: index("security_logs_created_idx").on(
      table.createdAt,
    ),
  }),
);

export const insertSecurityLogSchema =
  createInsertSchema(securityLogsTable).omit({
    id: true,
    createdAt: true,
  });

export type InsertSecurityLog = z.infer<
  typeof insertSecurityLogSchema
>;

export type SecurityLog =
  typeof securityLogsTable.$inferSelect;