import { Shield, Star, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

type SearchListing = {
  id: number;
  title: string;
  price: string;
  category?: string;
  condition?: string;
  location?: string;
  sellerId?: number;
  trustScore?: number;
  verified?: boolean;
};

type SearchResultsProps = {
  results: SearchListing[];
  query: string;
  category: string;
};

export function SearchResults({ results, query, category }: SearchResultsProps) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
        <span className="font-medium text-foreground">
          {query ? `"${query}"` : category}
        </span>
      </p>

      <div className="space-y-3">
        {results.map((r) => (
          <Link key={r.id} href={`/marketplace/${r.id}`}>
            <div className="rounded-2xl border bg-card p-4 flex items-center gap-4 hover:shadow-md transition cursor-pointer group">
              <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition">
                <ShieldCheck className="h-6 w-6 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-semibold text-sm truncate">{r.title}</h3>
                  {r.verified && <Shield className="h-3.5 w-3.5 text-primary shrink-0" />}
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-primary font-bold">₦{Number(r.price).toLocaleString()}</span>
                  {r.category && (
                    <span className="text-xs border px-2 py-0.5 rounded-full bg-muted">{r.category}</span>
                  )}
                  {r.condition && (
                    <span className="text-xs text-muted-foreground capitalize">{r.condition.replace("_", " ")}</span>
                  )}
                  {r.location && (
                    <span className="text-xs text-muted-foreground">{r.location}</span>
                  )}
                </div>

                {r.trustScore !== undefined && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-muted-foreground">Trust {r.trustScore}</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;
