import { db } from "@workspace/db";
import { listingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

export interface SearchIndex {
  id: number;
  type: "listing" | "user" | "company" | "service";
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  sellerId?: number;
  price?: number;
  createdAt: Date;
}

const inMemoryIndex: SearchIndex[] = [];

export async function indexListing(listingId: number): Promise<void> {
  try {
    const listing = await db.query.listingsTable.findFirst({ where: eq(listingsTable.id, listingId) });
    if (!listing) return;

    const idx = inMemoryIndex.findIndex((i) => i.type === "listing" && i.id === listingId);
    const entry: SearchIndex = {
      id: listing.id,
      type: "listing",
      title: listing.title,
      description: listing.description ?? undefined,
      category: listing.category ?? undefined,
      sellerId: listing.sellerId,
      price: parseFloat(listing.price),
      createdAt: listing.createdAt,
    };

    if (idx >= 0) inMemoryIndex[idx] = entry;
    else inMemoryIndex.push(entry);

    logger.debug({ listingId }, "Listing indexed");
  } catch (error) {
    logger.error({ error, listingId }, "Failed to index listing");
  }
}

export function removeFromIndex(id: number, type: SearchIndex["type"]): void {
  const idx = inMemoryIndex.findIndex((i) => i.id === id && i.type === type);
  if (idx >= 0) inMemoryIndex.splice(idx, 1);
}

export function searchIndex(query: string, type?: SearchIndex["type"], limit = 20): SearchIndex[] {
  const q = query.toLowerCase();
  return inMemoryIndex
    .filter((item) => {
      if (type && item.type !== type) return false;
      return item.title.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
    })
    .slice(0, limit);
}

export function getIndexSize(): number {
  return inMemoryIndex.length;
}
