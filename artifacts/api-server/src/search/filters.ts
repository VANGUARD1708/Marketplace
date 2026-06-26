import type { SQL } from "drizzle-orm";
import { gte, lte, eq, ilike, and } from "drizzle-orm";
import { listingsTable } from "@workspace/db";

export interface ListingFilters {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  location?: string;
  sellerId?: number;
}

export function buildListingFilters(filters: ListingFilters): SQL | undefined {
  const conditions: SQL[] = [];

  if (filters.q) {
    conditions.push(ilike(listingsTable.title, `%${filters.q}%`));
  }
  if (filters.category) {
    conditions.push(eq(listingsTable.category, filters.category));
  }
  if (filters.minPrice !== undefined) {
    conditions.push(gte(listingsTable.price, String(filters.minPrice)));
  }
  if (filters.maxPrice !== undefined) {
    conditions.push(lte(listingsTable.price, String(filters.maxPrice)));
  }
  if (filters.condition) {
    conditions.push(eq(listingsTable.condition, filters.condition));
  }
  if (filters.location) {
    conditions.push(ilike(listingsTable.location, `%${filters.location}%`));
  }
  if (filters.sellerId) {
    conditions.push(eq(listingsTable.sellerId, filters.sellerId));
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

export function parseFilterQuery(query: Record<string, string | string[] | undefined>): ListingFilters {
  return {
    q: typeof query.q === "string" ? query.q : undefined,
    category: typeof query.category === "string" ? query.category : undefined,
    minPrice: query.minPrice ? Number(query.minPrice) : undefined,
    maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
    condition: typeof query.condition === "string" ? query.condition : undefined,
    location: typeof query.location === "string" ? query.location : undefined,
    sellerId: query.sellerId ? Number(query.sellerId) : undefined,
  };
}
