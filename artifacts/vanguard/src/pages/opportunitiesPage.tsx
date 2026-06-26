import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Bookmark, BookmarkCheck, ExternalLink, X, MapPin, Clock, ChevronRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

import OpportunityAssistant from "@/components/opportunities/OpportunityAssistant";
import OpportunityCategories, { OpportunityCategory } from "@/components/opportunities/OpportunityCategories";
import OpportunityFilters, { OpportunityFiltersValue } from "@/components/opportunities/OpportunityFilter";
import OpportunityStats from "@/components/opportunities/OpportunityStats";

type ApiOpportunity = {
  id: number;
  title: string;
  description: string | null;
  category: string;
  organization: string | null;
  location: string | null;
  value: string | null;
  eligibility: string | null;
  applyUrl: string | null;
  deadline: string | null;
  verified: boolean;
  status: string;
  views: number;
  saves: number;
  createdAt: string;
  saved: boolean;
};

const CATEGORY_MAP: Record<OpportunityCategory, string> = {
  All: "all",
  Jobs: "job",
  Marketplace: "marketplace",
  Services: "service",
  Investments: "investment",
  Courses: "course",
  Partnerships: "partnership",
  Grants: "grant",
  Scholarships: "scholarship",
  Competitions: "competition",
  Internships: "internship",
  Government: "government",
  "Startup Funding": "startup",
};

function categoryLabel(cat: string) {
  const map: Record<string, string> = {
    grant: "Grant", scholarship: "Scholarship", competition: "Competition",
    internship: "Internship", government: "Government", startup: "Startup Funding",
    job: "Job", marketplace: "Marketplace", service: "Service",
    investment: "Investment", course: "Course", partnership: "Partnership",
  };
  return map[cat] ?? cat.charAt(0).toUpperCase() + cat.slice(1);
}

function deadlineLabel(iso: string | null) {
  if (!iso) return null;
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
  if (days < 0) return "Expired";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `${days}d left`;
}

function DetailDrawer({
  opp,
  onClose,
  onToggleSave,
  saving,
}: {
  opp: ApiOpportunity;
  onClose: () => void;
  onToggleSave: () => void;
  saving: boolean;
}) {
  const dl = deadlineLabel(opp.deadline);
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-lg bg-background h-full overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
          <h2 className="font-bold text-lg truncate pr-4">{opp.title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-medium">{opp.organization ?? "Unknown"}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                {opp.location && (
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{opp.location}</span>
                )}
                <span className="px-1.5 py-0.5 rounded-full bg-muted">{categoryLabel(opp.category)}</span>
                {opp.verified && <span className="text-primary font-medium">✓ Verified</span>}
              </div>
            </div>
            <button
              onClick={onToggleSave}
              disabled={saving}
              className="p-2 rounded-xl hover:bg-muted transition disabled:opacity-50"
            >
              {opp.saved
                ? <BookmarkCheck className="h-5 w-5 text-primary" />
                : <Bookmark className="h-5 w-5 text-muted-foreground" />}
            </button>
          </div>

          {opp.value && (
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Value / Reward</p>
              <p className="font-bold text-primary text-lg">{opp.value}</p>
            </div>
          )}

          {opp.description && (
            <div>
              <h3 className="font-semibold text-sm mb-2">About this opportunity</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{opp.description}</p>
            </div>
          )}

          {opp.eligibility && (
            <div>
              <h3 className="font-semibold text-sm mb-2">Eligibility</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{opp.eligibility}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Views</p>
              <p className="font-semibold">{opp.views.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Bookmarks</p>
              <p className="font-semibold">{opp.saves.toLocaleString()}</p>
            </div>
            {opp.deadline && (
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground mb-0.5">Deadline</p>
                <p className="font-semibold flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(opp.deadline).toLocaleDateString()}
                </p>
              </div>
            )}
            {dl && (
              <div className={`rounded-xl p-3 ${dl === "Expired" ? "bg-red-50 border border-red-200" : "bg-amber-50 border border-amber-200"}`}>
                <p className="text-xs text-muted-foreground mb-0.5">Time Left</p>
                <p className={`font-semibold ${dl === "Expired" ? "text-red-600" : "text-amber-600"}`}>{dl}</p>
              </div>
            )}
          </div>

          {opp.applyUrl ? (
            <a
              href={opp.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
            >
              Apply Now <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <div className="w-full py-3 rounded-2xl bg-muted text-muted-foreground font-medium text-center text-sm">
              No application link available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OpportunitiesPage() {
  const qc = useQueryClient();
  const { user } = useAuth();

  // Single authoritative category — tile selector drives it; search filter can also clear it
  const [category, setCategory] = useState<OpportunityCategory>("All");

  const [filters, setFilters] = useState<OpportunityFiltersValue>({
    search: "",
    category: "All",
    location: "Anywhere",
    verifiedOnly: false,
    guardianOnly: false,
    deadlineWindow: "",
  });

  const [selected, setSelected] = useState<ApiOpportunity | null>(null);

  // When the filter panel's category dropdown changes, also update the tile selection if it matches
  function handleFilterChange(next: OpportunityFiltersValue) {
    setFilters(next);
    // If filter panel category changed and is a valid tile, sync the tile selector
    if (next.category !== filters.category) {
      const matched = Object.keys(CATEGORY_MAP).find(
        (k) => k.toLowerCase() === next.category.toLowerCase(),
      ) as OpportunityCategory | undefined;
      if (matched) setCategory(matched);
      else setCategory("All");
    }
  }

  // When tile category changes, also reset the filter panel's category dropdown
  function handleCategorySelect(cat: OpportunityCategory) {
    setCategory(cat);
    setFilters((prev) => ({ ...prev, category: cat }));
  }

  // Build API params from the unified category + filters
  const apiCategory = CATEGORY_MAP[category] ?? "all";
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.verifiedOnly) params.set("verified", "true");
  if (filters.location && filters.location !== "Anywhere") params.set("location", filters.location);
  if (apiCategory !== "all") params.set("category", apiCategory);
  if (filters.deadlineWindow) params.set("deadlineWindow", filters.deadlineWindow);

  const queryKey = ["opportunities", filters.search, apiCategory, filters.location, filters.verifiedOnly, filters.deadlineWindow];

  const { data: opps = [], isLoading, error } = useQuery<ApiOpportunity[]>({
    queryKey,
    queryFn: () => apiFetch<ApiOpportunity[]>(`/opportunities?${params}`),
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, saved }: { id: number; saved: boolean }) =>
      saved
        ? apiFetch(`/opportunities/${id}/save`, { method: "DELETE" })
        : apiFetch(`/opportunities/${id}/save`, { method: "POST" }),
    onSuccess: (_data, vars) => {
      qc.setQueryData<ApiOpportunity[]>(
        queryKey,
        (prev: ApiOpportunity[] | undefined) =>
          prev?.map((o) =>
            o.id === vars.id
              ? { ...o, saved: !vars.saved, saves: o.saves + (vars.saved ? -1 : 1) }
              : o,
          ),
      );
      if (selected?.id === vars.id) {
        setSelected((prev: ApiOpportunity | null) =>
          prev ? { ...prev, saved: !vars.saved, saves: prev.saves + (vars.saved ? -1 : 1) } : prev,
        );
      }
    },
  });

  // Client-side guardian filter (verified-only already sent to API)
  const filtered = useMemo(() => {
    return opps.filter((item) => !filters.guardianOnly || item.verified);
  }, [opps, filters.guardianOnly]);

  const totalCount = filtered.length;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {selected && (
        <DetailDrawer
          opp={selected}
          onClose={() => setSelected(null)}
          onToggleSave={() => saveMutation.mutate({ id: selected.id, saved: selected.saved })}
          saving={saveMutation.isPending}
        />
      )}

      <div>
        <h1 className="text-4xl font-bold">Opportunities</h1>
        <p className="text-muted-foreground mt-2">
          Vanguard brings together jobs, grants, scholarships, investments, competitions, internships and more in one trusted ecosystem.
        </p>
      </div>

      <OpportunityStats
        data={{
          activeOpportunities: totalCount || 0,
          verifiedBusinesses: opps.filter((o) => o.verified).length,
          totalOpportunityValue: "₦12.4B",
          successRate: 96,
          guardianProtected: 98,
          todayOpportunities: Math.min(opps.length, 50),
        }}
      />

      <OpportunityAssistant
        onSuggestionSelect={(query) => setFilters((prev) => ({ ...prev, search: query }))}
      />

      <OpportunityCategories selected={category} onSelect={handleCategorySelect} />

      <OpportunityFilters value={filters} onChange={handleFilterChange} />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {category === "All" ? "All Opportunities" : `${category} Opportunities`}
          </h2>
          <p className="text-muted-foreground">Based on your filters and location.</p>
        </div>
        <span className="text-sm text-muted-foreground">{totalCount} found</span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading opportunities…
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {(error as Error).message}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border bg-card p-10 text-center">
          <h3 className="text-xl font-semibold">No opportunities found</h3>
          <p className="text-muted-foreground mt-2">Try changing your filters or category.</p>
          <button
            onClick={() => { setCategory("All"); setFilters((prev) => ({ ...prev, search: "", category: "All" })); }}
            className="mt-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {filtered.map((item) => {
            const dl = deadlineLabel(item.deadline);
            return (
              <div
                key={item.id}
                className="rounded-2xl border bg-card p-5 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelected(item)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-primary/10 p-3 shrink-0 flex items-center justify-center w-12 h-12">
                      <span className="text-primary font-bold text-sm">
                        {(item.organization ?? item.title)[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg leading-tight">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.organization ?? "Unknown"}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      saveMutation.mutate({ id: item.id, saved: item.saved });
                    }}
                    className="p-1.5 rounded-lg hover:bg-muted transition shrink-0"
                  >
                    {item.saved
                      ? <BookmarkCheck className="h-5 w-5 text-primary" />
                      : <Bookmark className="h-5 w-5 text-muted-foreground" />}
                  </button>
                </div>

                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{item.description}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted border">{categoryLabel(item.category)}</span>
                  {item.verified && (
                    <span className="text-xs px-2 py-0.5 rounded-full text-primary bg-primary/10">✓ Verified</span>
                  )}
                  {item.value && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                      {item.value}
                    </span>
                  )}
                  {dl && (
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${dl === "Expired" ? "text-red-600 bg-red-50 border-red-200" : "text-amber-600 bg-amber-50 border-amber-200"}`}>
                      {dl}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4">
                  {item.location && (
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.location}</span>
                  )}
                  <span>{item.views} views · {item.saves} saves</span>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-2xl border bg-card p-6">
        <h2 className="text-2xl font-bold mb-4">🔥 Success Stories</h2>
        <div className="space-y-4">
          <div className="rounded-xl border p-4">✅ Sarah got hired as a software engineer through Vanguard.</div>
          <div className="rounded-xl border p-4">💰 John sold his vehicle using Vanguard Escrow.</div>
          <div className="rounded-xl border p-4">🚀 A startup raised ₦15,000,000 through verified investors.</div>
          <div className="rounded-xl border p-4">🤝 A farmer connected with a nationwide distributor.</div>
        </div>
      </div>
    </div>
  );
}
