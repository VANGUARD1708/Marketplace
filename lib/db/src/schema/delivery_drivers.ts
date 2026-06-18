import { pgTable, serial, integer, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const deliveryDriversTable = pgTable("delivery_drivers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  vehicleType: text("vehicle_type"),
  isVerified: boolean("is_verified").notNull().default(false),
  isAvailable: boolean("is_available").notNull().default(false),
  rating: text("rating"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDeliveryDriverSchema = createInsertSchema(deliveryDriversTable).omit({ id: true, createdAt: true });
export type InsertDeliveryDriver = z.infer<typeof insertDeliveryDriverSchema>;
export type DeliveryDriver = typeof deliveryDriversTable.$inferSelect;
