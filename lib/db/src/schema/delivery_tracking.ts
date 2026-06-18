import { pgTable, serial, integer, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const deliveryTrackingTable = pgTable("delivery_tracking", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  driverId: integer("driver_id").notNull(),
  status: text("status").notNull().default("assigned"),
  currentLat: numeric("current_lat", { precision: 10, scale: 7 }),
  currentLng: numeric("current_lng", { precision: 10, scale: 7 }),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertDeliveryTrackingSchema = createInsertSchema(deliveryTrackingTable).omit({ id: true, updatedAt: true });
export type InsertDeliveryTracking = z.infer<typeof insertDeliveryTrackingSchema>;
export type DeliveryTracking = typeof deliveryTrackingTable.$inferSelect;
