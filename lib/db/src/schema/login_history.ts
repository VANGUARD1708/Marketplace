import {
  pgTable,
  serial,
  integer,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const loginHistoryTable = pgTable(
  "login_history",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id").notNull(),

    email: text("email"),

    deviceId: text("device_id"),

    deviceName: text("device_name"),

    operatingSystem: text("operating_system"),

    browser: text("browser"),

    ipAddress: text("ip_address"),

    country: text("country"),

    city: text("city"),

    loginMethod: text("login_method").notNull(),

    loginStatus: text("login_status").notNull(),

    failureReason: text("failure_reason"),

    twoFactorPassed: boolean("two_factor_passed")
      .notNull()
      .default(false),

    biometricPassed: boolean("biometric_passed")
      .notNull()
      .default(false),

    trustedDevice: boolean("trusted_device")
      .notNull()
      .default(false),

    riskScore: integer("risk_score")
      .notNull()
      .default(0),

    loggedInAt: timestamp("logged_in_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index("login_history_user_idx").on(table.userId),

    loginStatusIdx: index("login_history_status_idx").on(
      table.loginStatus,
    ),

    ipIdx: index("login_history_ip_idx").on(
      table.ipAddress,
    ),
  }),
);

export const insertLoginHistorySchema =
  createInsertSchema(loginHistoryTable).omit({
    id: true,
    loggedInAt: true,
  });

export type InsertLoginHistory = z.infer<
  typeof insertLoginHistorySchema
>;

export type LoginHistory =
  typeof loginHistoryTable.$inferSelect;