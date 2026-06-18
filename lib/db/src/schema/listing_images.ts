import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const listingImagesTable = pgTable("listing_images", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").notNull(),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertListingImageSchema = createInsertSchema(listingImagesTable).omit({ id: true, createdAt: true });
export type InsertListingImage = z.infer<typeof insertListingImageSchema>;
export type ListingImage = typeof listingImagesTable.$inferSelect;
