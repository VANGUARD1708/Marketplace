import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const permissionsTable = pgTable(
  "permissions",
  {
    id: serial("id").primaryKey(),

    name: text("name").notNull().unique(),

    slug: text("slug").notNull().unique(),

    module: text("module").notNull(),

    description: text("description"),

    isSystem: boolean("is_system").notNull().default(true),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: index("permissions_slug_idx").on(table.slug),
    moduleIdx: index("permissions_module_idx").on(table.module),
  }),
);

export const insertPermissionSchema =
  createInsertSchema(permissionsTable).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export type InsertPermission = z.infer<typeof insertPermissionSchema>;

export type Permission = typeof permissionsTable.$inferSelect;