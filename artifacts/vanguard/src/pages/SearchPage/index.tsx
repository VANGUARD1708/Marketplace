import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search, X, TrendingUp, SlidersHorizontal, Loader2, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Listing = { id: number; title: string; price: string; category?: string; condition?: string };

const POPULAR = ["iPhone", "MacBook", "Laptop", "Generator", "Car", "Samsung", "Shoes", "Apartment"];
const CATEGORIES = ["All", "Electronics", "Fashion", "Vehicles", "Home", "Services", "Jobs"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ["search", debouncedQuery, category],
    queryFn: () => {
      const params = new URLSearchParams();
      if (debouncedQuery) params.set("q", debouncedQuery);
      if (category !== "All") params.set("category", category);
      return apiFetch<Listing[]>(`/marketplace/listings?${params.toString()}`);
    },
    enabled: debouncedQuery.length >= 2 || category !== "All",
  });

  const { data: suggestions = [] } = useQuery({
    queryKey: ["suggestions", query],
    queryFn: () => apiFetch<string[]>(`/marketplace/listings?q=${encodeURIComponent(query)}`).then((r) =>
      (Array.isArray(r) ? r : []).slice(0, 6).map((l: Listing) => l.title)
    ),
    enabled: query.length >= 2 && query === debouncedQuery,
  });

  const hasResults = debouncedQuery.length >= 2 || category !== "All";

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, services, jobs..."
          className="w-full rounded-2xl border bg-card pl-10 pr-10 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition"
        />
        {query && (
          <button onClick={() => { setQuery(""); setDebouncedQuery(""); }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
              category === c ? "bg-primary text-primary-foreground" : "border hover:bg-muted"
            }`}>
            {c}
          </button>
        ))}
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition ${showFilters ? "bg-accent" : "hover:bg-muted"}`}>
          <SlidersHorizontal className="h-3 w-3" /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="rounded-2xl border bg-card p-4 mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Min Price (₦)</label>
            <input type="number" placeholder="0" className="w-full rounded-lg border bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Max Price (₦)</label>
            <input type="number" placeholder="Any" className="w-full rounded-lg border bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Condition</label>
            <select className="w-full rounded-lg border bg-background px-3 py-2 text-sm">
              <option value="">Any</option>
              <option value="new">New</option>
              <option value="like_new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Location</label>
            <input type="text" placeholder="e.g. Lagos" className="w-full rounded-lg border bg-background px-3 py-2 text-sm" />
          </div>
        </div>
      )}

      {/* Popular searches */}
      {!hasResults && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Popular Searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR.map((p) => (
              <button key={p} onClick={() => setQuery(p)}
                className="px-3 py-1.5 rounded-full border text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition">
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && hasResults && (
        <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      )}

      {/* Results */}
      {hasResults && !isLoading && (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
            {debouncedQuery ? `"${debouncedQuery}"` : category}
          </p>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-semibold">No results found</p>
              <p className="text-sm text-muted-foreground mt-1">Try different keywords or browse categories.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((r) => (
                <Link key={r.id} href={`/marketplace/${r.id}`}>
                  <div className="rounded-2xl border bg-card p-4 flex items-center gap-4 hover:shadow-md transition cursor-pointer">
                    <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate mb-1">{r.title}</h3>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-primary font-bold">₦{Number(r.price).toLocaleString()}</span>
                        {r.category && <span className="text-xs border px-2 py-0.5 rounded-full">{r.category}</span>}
                        {r.condition && <span className="text-xs text-muted-foreground">{r.condition}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
