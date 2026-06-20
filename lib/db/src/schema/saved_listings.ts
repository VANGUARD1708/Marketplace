import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const savedListingsTable = pgTable("saved_listings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  listingId: integer("listing_id").notNull(),
  savedAt: timestamp("saved_at").notNull().defaultNow(),
});

export const insertSavedListingSchema = createInsertSchema(savedListingsTable).omit({ id: true, savedAt: true });
export type InsertSavedListing = z.infer<typeof insertSavedListingSchema>;
export type SavedListing = typeof savedListingsTable.$inferSelect;
