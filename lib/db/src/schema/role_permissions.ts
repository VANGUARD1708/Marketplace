import {
  pgTable,
  serial,
  integer,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const rolePermissionsTable = pgTable(
  "role_permissions",
  {
    id: serial("id").primaryKey(),

    roleId: integer("role_id").notNull(),

    permissionId: integer("permission_id").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    rolePermissionUnique: uniqueIndex("role_permission_unique").on(
      table.roleId,
      table.permissionId,
    ),
  }),
);

export const insertRolePermissionSchema =
  createInsertSchema(rolePermissionsTable).omit({
    id: true,
    createdAt: true,
  });

export type InsertRolePermission = z.infer<
  typeof insertRolePermissionSchema
>;

export type RolePermission =
  typeof rolePermissionsTable.$inferSelect;