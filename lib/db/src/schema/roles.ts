import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const rolesTable = pgTable(
  "roles",
  {
    id: serial("id").primaryKey(),

    name: text("name").notNull().unique(),

    slug: text("slug").notNull().unique(),

    description: text("description"),

    level: integer("level").notNull().default(1),

    isSystem: boolean("is_system").notNull().default(false),

    isActive: boolean("is_active").notNull().default(true),

    createdBy: integer("created_by"),

    updatedBy: integer("updated_by"),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: index("roles_slug_idx").on(table.slug),
    levelIdx: index("roles_level_idx").on(table.level),
  }),
);

export const insertRoleSchema = createInsertSchema(rolesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertRole = z.infer<typeof insertRoleSchema>;

export type Role = typeof rolesTable.$inferSelect;