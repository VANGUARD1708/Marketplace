import { pgTable, serial, integer, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const communitiesTable = pgTable("communities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default("General"),
  isPrivate: boolean("is_private").notNull().default(false),
  trustRequired: integer("trust_required").notNull().default(0),
  coverColor: text("cover_color").notNull().default("from-blue-500 to-blue-700"),
  bannerUrl: text("banner_url"),
  memberCount: integer("member_count").notNull().default(0),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCommunitySchema = createInsertSchema(communitiesTable).omit({ id: true, createdAt: true, updatedAt: true, memberCount: true });
export type InsertCommunity = z.infer<typeof insertCommunitySchema>;
export type Community = typeof communitiesTable.$inferSelect;
