import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

import {
  Search,
  SlidersHorizontal,
  Loader2,
  ShieldCheck,
  Flame,
  Eye,
  Heart,
  MessageCircle,
} from "lucide-react";

import { apiFetch } from "@/lib/api";

type Listing = {
  id: number;
  sellerId: number;
  title: string;
  description?: string;
  price: string;
  category?: string;
  condition?: string;
  status: string;
  createdAt: string;

  trustScore?: number;
  views?: number;
  saves?: number;
  verified?: boolean;
  trending?: boolean;
};

const CATEGORIES = [
  "All",
  "Electronics",
  "Fashion",
  "Vehicles",
  "Home",
  "Services",
  "Other",
];

const TABS = [
  "For You",
  "Trending",
  "Verified",
  "Nearby",
];

export default function MarketplacePage() {
  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const [tab, setTab] =
    useState("For You");

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["listings"],
    queryFn: () =>
      apiFetch<Listing[]>(
        "/marketplace/listings",
      ),
  });

  const listings = (
    data ?? []
  ).filter((l) => {
    const matchSearch =
      !search ||
      l.title
        .toLowerCase()
        .includes(
          search.toLowerCase(),
        );

    const matchCategory =
      category === "All" ||
      l.category === category;

    return (
      matchSearch &&
      matchCategory &&
      l.status === "active"
    );
  });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Marketplace
        </h1>

        <p className="text-muted-foreground">
          Discover trusted deals
          across Vanguard
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-6">
        {TABS.map((item) => (
          <button
            key={item}
            onClick={() =>
              setTab(item)
            }
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
              tab === item
                ? "bg-primary text-primary-foreground"
                : "border"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">
              🔥 Trending
            </p>

            <p className="text-xl font-bold">
              124
            </p>
          </div>

          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">
              🛡 Protected
            </p>

            <p className="text-xl font-bold">
              98%
            </p>
          </div>

          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">
              ⭐ Verified
            </p>

            <p className="text-xl font-bold">
              340
            </p>
          </div>

          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">
              ⚡ Active Deals
            </p>

            <p className="text-xl font-bold">
              {listings.length}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value,
              )
            }
            placeholder="Search products, services, jobs..."
            className="w-full rounded-xl border bg-background pl-10 pr-3 py-2"
          />
        </div>

        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value,
            )
          }
          className="rounded-xl border px-3 py-2"
        >
          {CATEGORIES.map(
            (category) => (
              <option
                key={category}
              >
                {category}
              </option>
            ),
          )}
        </select>

        <button className="flex items-center gap-2 rounded-xl border px-3 py-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>

        <Link href="/create-listing">
          <button className="rounded-xl bg-primary text-primary-foreground px-4 py-2">
            + Create
          </button>
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500 p-4 text-red-500">
          {String(error)}
        </div>
      )}

      {!isLoading &&
        listings.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-lg font-semibold">
              No listings found
            </h2>

            <p className="text-muted-foreground">
              Try another search
            </p>
          </div>
        )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {listings.map(
          (listing) => (
            <Link
              key={listing.id}
              href={`/marketplace/${listing.id}`}
            >
              <div className="rounded-2xl border overflow-hidden bg-card hover:shadow-lg transition cursor-pointer">
                <div className="relative h-56 bg-muted">
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      🔥 Trending
                    </span>

                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                      🛡 Safe
                    </span>
                  </div>

                  <div className="h-full flex items-center justify-center">
                    No Image
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold line-clamp-2">
                      {
                        listing.title
                      }
                    </h3>

                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                  </div>

                  <p className="text-2xl font-bold text-primary mb-3">
                    ₦
                    {Number(
                      listing.price,
                    ).toLocaleString()}
                  </p>

                  <div className="flex gap-2 flex-wrap mb-3">
                    <span className="text-xs border px-2 py-1 rounded-full">
                      ⭐ 92
                    </span>

                    <span className="text-xs border px-2 py-1 rounded-full">
                      Verified
                    </span>

                    {listing.category && (
                      <span className="text-xs border px-2 py-1 rounded-full">
                        {
                          listing.category
                        }
                      </span>
                    )}
                  </div>

                  <div className="flex gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      320
                    </span>

                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      45
                    </span>

                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      8
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button className="rounded-lg border py-2 text-sm">
                      Chat
                    </button>

                    <button className="rounded-lg bg-primary text-primary-foreground py-2 text-sm">
                      Offer
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ),
        )}
      </div>
    </div>
  );
}