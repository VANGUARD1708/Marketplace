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

export const userPermissionsTable = pgTable(
  "user_permissions",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id").notNull(),

    permissionId: integer("permission_id").notNull(),

    granted: boolean("granted").notNull().default(true),

    assignedBy: integer("assigned_by"),

    expiresAt: timestamp("expires_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("user_permissions_user_idx").on(table.userId),

    permissionIdx: index("user_permissions_permission_idx").on(
      table.permissionId,
    ),

    uniqueUserPermission: uniqueIndex("user_permissions_unique").on(
      table.userId,
      table.permissionId,
    ),
  }),
);

export const insertUserPermissionSchema =
  createInsertSchema(userPermissionsTable).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export type InsertUserPermission = z.infer<
  typeof insertUserPermissionSchema
>;

export type UserPermission =
  typeof userPermissionsTable.$inferSelect;