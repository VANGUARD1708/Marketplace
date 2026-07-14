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

export const twoFactorTable = pgTable(
  "two_factor",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id").notNull(),

    secret: text("secret").notNull(),

    issuer: text("issuer").notNull().default("Vanguard"),

    algorithm: text("algorithm").notNull().default("SHA1"),

    digits: integer("digits").notNull().default(6),

    period: integer("period").notNull().default(30),

    backupCodes: text("backup_codes").array(),

    isEnabled: boolean("is_enabled").notNull().default(false),

    verifiedAt: timestamp("verified_at"),

    lastUsedAt: timestamp("last_used_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("two_factor_user_idx").on(table.userId),

    uniqueUser: uniqueIndex("two_factor_user_unique").on(table.userId),
  }),
);

export const insertTwoFactorSchema =
  createInsertSchema(twoFactorTable).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export type InsertTwoFactor = z.infer<
  typeof insertTwoFactorSchema
>;

export type TwoFactor =
  typeof twoFactorTable.$inferSelect;