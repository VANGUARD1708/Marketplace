import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search, SlidersHorizontal, Loader2, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Listing = { id: number; sellerId: number; title: string; description?: string; price: string; category?: string; condition?: string; status: string; createdAt: string };

const CATEGORIES = ["All", "Electronics", "Fashion", "Vehicles", "Home", "Services", "Other"];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const { data, isLoading, error } = useQuery({
    queryKey: ["listings"],
    queryFn: () => apiFetch<Listing[]>("/marketplace/listings"),
  });

  const listings = (data ?? []).filter((l) => {
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || l.category === category;
    return matchSearch && matchCat && l.status === "active";
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground">Buy and sell safely on Vanguard</p>
        </div>
        <Link href="/create-listing">
          <span className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium cursor-pointer">
            + Create Listing
          </span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-xl border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border bg-background px-3 py-2 text-sm"
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-accent transition">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive mb-4">
          {error.message}
        </div>
      )}

      {!isLoading && listings.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium mb-1">No listings found</p>
          <p className="text-sm">Try adjusting your search or filters.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {listings.map((listing) => (
          <Link key={listing.id} href={`/marketplace/${listing.id}`}>
            <div className="rounded-xl border bg-card overflow-hidden hover:shadow-md transition cursor-pointer">
              <div className="h-44 bg-muted flex items-center justify-center">
                <span className="text-xs text-muted-foreground">No image</span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2">{listing.title}</h3>
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                </div>
                <p className="text-primary font-bold mb-2">₦{Number(listing.price).toLocaleString()}</p>
                {listing.category && <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{listing.category}</span>}
                {listing.condition && <span className="text-xs text-muted-foreground ml-2">{listing.condition}</span>}
                <div className="mt-3">
                  <button className="w-full rounded-lg border py-1.5 text-xs font-medium hover:bg-accent transition">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
