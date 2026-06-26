export interface RankableItem {
  id: number;
  createdAt: Date | string;
  viewCount?: number;
  trustScore?: number;
  price?: string | number;
}

export type SortOrder = "newest" | "oldest" | "price_asc" | "price_desc" | "most_viewed" | "trust_score";

export function sortItems<T extends RankableItem>(items: T[], order: SortOrder): T[] {
  return [...items].sort((a, b) => {
    switch (order) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "price_asc":
        return Number(a.price ?? 0) - Number(b.price ?? 0);
      case "price_desc":
        return Number(b.price ?? 0) - Number(a.price ?? 0);
      case "most_viewed":
        return (b.viewCount ?? 0) - (a.viewCount ?? 0);
      case "trust_score":
        return (b.trustScore ?? 0) - (a.trustScore ?? 0);
      default:
        return 0;
    }
  });
}

export function computeRelevanceScore(item: RankableItem, query: string): number {
  let score = 0;
  const ageHours = (Date.now() - new Date(item.createdAt).getTime()) / 3600_000;
  score += Math.max(0, 100 - ageHours);
  score += (item.viewCount ?? 0) * 0.5;
  score += (item.trustScore ?? 0) * 0.3;
  return score;
}
