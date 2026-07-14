import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const adminSessionsTable = pgTable(
  "admin_sessions",
  {
    id: serial("id").primaryKey(),

    adminId: integer("admin_id").notNull(),

    sessionToken: text("session_token").notNull(),

    refreshToken: text("refresh_token"),

    deviceId: text("device_id"),

    deviceName: text("device_name"),

    operatingSystem: text("operating_system"),

    browser: text("browser"),

    ipAddress: text("ip_address"),

    country: text("country"),

    city: text("city"),

    isSuperAdmin: boolean("is_super_admin")
      .notNull()
      .default(false),

    isActive: boolean("is_active")
      .notNull()
      .default(true),

    revoked: boolean("revoked")
      .notNull()
      .default(false),

    revokedReason: text("revoked_reason"),

    lastActivityAt: timestamp("last_activity_at")
      .defaultNow()
      .notNull(),

    expiresAt: timestamp("expires_at").notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    adminIdx: index("admin_sessions_admin_idx").on(
      table.adminId,
    ),

    activeIdx: index("admin_sessions_active_idx").on(
      table.isActive,
    ),

    expiryIdx: index("admin_sessions_expiry_idx").on(
      table.expiresAt,
    ),

    tokenUnique: uniqueIndex("admin_session_token_unique").on(
      table.sessionToken,
    ),
  }),
);

export const insertAdminSessionSchema =
  createInsertSchema(adminSessionsTable).omit({
    id: true,
    createdAt: true,
    lastActivityAt: true,
  });

export type InsertAdminSession = z.infer<
  typeof insertAdminSessionSchema
>;

export type AdminSession =
  typeof adminSessionsTable.$inferSelect;