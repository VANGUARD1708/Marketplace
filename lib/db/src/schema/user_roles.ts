import {
  pgTable,
  serial,
  integer,
 timestamp,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userRolesTable = pgTable(
  "user_roles",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id").notNull(),

    roleId: integer("role_id").notNull(),

    isPrimary: boolean("is_primary").notNull().default(false),

    isActive: boolean("is_active").notNull().default(true),

    assignedBy: integer("assigned_by"),

    expiresAt: timestamp("expires_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("user_roles_user_idx").on(table.userId),

    roleIdx: index("user_roles_role_idx").on(table.roleId),

    uniqueUserRole: uniqueIndex("user_roles_unique").on(
      table.userId,
      table.roleId,
    ),
  }),
);

export const insertUserRoleSchema =
  createInsertSchema(userRolesTable).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export type InsertUserRole = z.infer<
  typeof insertUserRoleSchema
>;

export type UserRole =
  typeof userRolesTable.$inferSelect;