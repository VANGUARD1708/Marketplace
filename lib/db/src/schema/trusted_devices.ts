import {
  pgTable,
  serial,
  integer,
  text,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const trustedDevicesTable = pgTable(
  "trusted_devices",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id").notNull(),

    deviceId: text("device_id").notNull(),

    deviceName: text("device_name"),

    deviceType: text("device_type"),

    operatingSystem: text("operating_system"),

    browser: text("browser"),

    ipAddress: text("ip_address"),

    country: text("country"),

    city: text("city"),

    lastLatitude: text("last_latitude"),

    lastLongitude: text("last_longitude"),

    trusted: boolean("trusted").notNull().default(false),

    biometricEnabled: boolean("biometric_enabled")
      .notNull()
      .default(false),

    faceIdEnabled: boolean("face_id_enabled")
      .notNull()
      .default(false),

    fingerprintEnabled: boolean("fingerprint_enabled")
      .notNull()
      .default(false),

    lastLoginAt: timestamp("last_login_at"),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index("trusted_devices_user_idx").on(table.userId),

    deviceIdx: uniqueIndex("trusted_devices_device_unique").on(
      table.deviceId,
    ),
  }),
);

export const insertTrustedDeviceSchema =
  createInsertSchema(trustedDevicesTable).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export type InsertTrustedDevice = z.infer<
  typeof insertTrustedDeviceSchema
>;

export type TrustedDevice =
  typeof trustedDevicesTable.$inferSelect;