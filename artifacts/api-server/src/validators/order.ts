import { z } from "zod/v4";

export const createOrderSchema = z.object({
  listingId: z.number().int().positive(),
  quantity: z.number().int().positive().default(1),
  useEscrow: z.boolean().default(true),
  shippingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().default("Nigeria"),
    postalCode: z.string().optional(),
  }).optional(),
  note: z.string().max(500).optional(),
});

export const updateOrderSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled", "refunded"]),
  trackingNumber: z.string().optional(),
  note: z.string().max(500).optional(),
});

export const reviewOrderSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(1000).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type ReviewOrderInput = z.infer<typeof reviewOrderSchema>;
