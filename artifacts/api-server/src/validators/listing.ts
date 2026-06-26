import { z } from "zod/v4";

const CATEGORIES = ["Electronics", "Fashion", "Vehicles", "Home", "Services", "Food", "Jobs", "Courses", "Other"] as const;
const CONDITIONS = ["new", "like_new", "good", "fair", "poor"] as const;

export const createListingSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  price: z.number().positive(),
  category: z.enum(CATEGORIES),
  condition: z.enum(CONDITIONS).optional(),
  location: z.string().max(100).optional(),
  images: z.string().url().array().max(10).optional(),
  tags: z.string().array().max(10).optional(),
  negotiable: z.boolean().default(false),
});

export const updateListingSchema = createListingSchema.partial();

export const listingQuerySchema = z.object({
  q: z.string().optional(),
  category: z.enum(CATEGORIES).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  condition: z.enum(CONDITIONS).optional(),
  location: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type ListingQuery = z.infer<typeof listingQuerySchema>;
