import { pgTable, serial, integer, text, boolean, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const opportunitiesTable = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id"),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull().default("general"),
  organization: text("organization"),
  location: text("location"),
  value: text("value"),
  eligibility: text("eligibility"),
  applyUrl: text("apply_url"),
  deadline: timestamp("deadline"),
  verified: boolean("verified").notNull().default(false),
  status: text("status").notNull().default("active"),
  views: integer("views").notNull().default(0),
  saves: integer("saves").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const savedOpportunitiesTable = pgTable("saved_opportunities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  opportunityId: integer("opportunity_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [unique("saved_opp_user_opp_uniq").on(t.userId, t.opportunityId)]);

export const insertOpportunitySchema = createInsertSchema(opportunitiesTable).omit({ id: true, createdAt: true, updatedAt: true, views: true, saves: true });
export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;
export type Opportunity = typeof opportunitiesTable.$inferSelect;

export const insertSavedOpportunitySchema = createInsertSchema(savedOpportunitiesTable).omit({ id: true, createdAt: true });
export type InsertSavedOpportunity = z.infer<typeof insertSavedOpportunitySchema>;
export type SavedOpportunity = typeof savedOpportunitiesTable.$inferSelect;
