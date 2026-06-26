import { db } from "@workspace/db";
import { listingsTable } from "@workspace/db";
import { ilike, eq } from "drizzle-orm";

const POPULAR_SEARCHES = [
  "iPhone", "MacBook", "Samsung", "laptop", "car", "apartment",
  "generator", "fashion", "shoes", "furniture", "motorcycle",
];

export async function getSearchSuggestions(query: string, limit = 8): Promise<string[]> {
  if (!query || query.trim().length < 2) return POPULAR_SEARCHES.slice(0, 5);

  const q = query.trim().toLowerCase();
  const static_matches = POPULAR_SEARCHES.filter((t) => t.toLowerCase().startsWith(q)).slice(0, 3);

  try {
    const listings = await db.query.listingsTable.findMany({
      where: ilike(listingsTable.title, `${q}%`),
      columns: { title: true },
      limit: limit - static_matches.length,
    });

    const dynamic = listings.map((l) => l.title);
    const all = [...new Set([...static_matches, ...dynamic])].slice(0, limit);
    return all;
  } catch {
    return static_matches;
  }
}

export async function getPopularCategories() {
  return ["Electronics", "Fashion", "Vehicles", "Home", "Services", "Jobs"];
}

export async function getTrendingListings(limit = 6) {
  return db.query.listingsTable.findMany({
    where: eq(listingsTable.status, "active"),
    limit,
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });
}
