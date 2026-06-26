import { z } from "zod";
import { APP } from "@/constants/app";

export const createListingSchema = z.object({
  title: z.string().min(3, "Title too short").max(200, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(5000),
  price: z.number({ invalid_type_error: "Enter a valid price" }).positive("Price must be positive"),
  category: z.enum(APP.LISTING_CATEGORIES as [string, ...string[]]),
  condition: z.string().optional(),
  location: z.string().max(100).optional(),
  negotiable: z.boolean().default(false),
});

export const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
});

export type CreateListingFormValues = z.infer<typeof createListingSchema>;
export type SearchFormValues = z.infer<typeof searchSchema>;
