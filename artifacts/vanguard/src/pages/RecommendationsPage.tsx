import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, ShoppingBag, Briefcase, Wrench, BookOpen, Shield, Star, ChevronRight, Loader2, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { apiFetch } from "@/lib/api";

type RecommendationType = "listing" | "service" | "job" | "course";

type Recommendation = {
  id: number;
  type: RecommendationType;
  title: string;
  subtitle: string;
  price?: string;
  rating?: number;
  reviewCount?: number;
  trustScore?: number;
  verified?: boolean;
  reason: string;
  href: string;
  accentColor: string;
};

const TYPE_CONFIG: Record<RecommendationType, { icon: typeof ShoppingBag; label: string }> = {
  listing: { icon: ShoppingBag, label: "Product" },
  service: { icon: Wrench, label: "Service" },
  job: { icon: Briefcase, label: "Job" },
  course: { icon: BookOpen, label: "Course" },
};

const MOCK_RECOMMENDATIONS: Recommendation[] = [
  { id: 1, type: "listing", title: "iPhone 14 Pro Max 256GB", subtitle: "Lagos Island · Verified Seller", price: "1,150,000", rating: 4.9, reviewCount: 23, trustScore: 91, verified: true, reason: "Based on your electronics searches", href: "/marketplace/1", accentColor: "bg-blue-50 border-blue-100" },
  { id: 2, type: "service", title: "Professional Website Design", subtitle: "Freelancer · Lekki · 3 day delivery", price: "85,000", rating: 4.8, reviewCount: 41, trustScore: 87, verified: true, reason: "Popular in your industry", href: "/services/1", accentColor: "bg-purple-50 border-purple-100" },
  { id: 3, type: "job", title: "Senior React Developer", subtitle: "TechHub Africa · Full-time · Remote", price: "450,000/mo", rating: undefined, reviewCount: undefined, trustScore: 82, verified: true, reason: "Matches your profile skills", href: "/jobs/1", accentColor: "bg-emerald-50 border-emerald-100" },
  { id: 4, type: "course", title: "Digital Marketing Masterclass", subtitle: "By Chioma Okonkwo · 24 hours", price: "35,000", rating: 4.7, reviewCount: 156, trustScore: 79, verified: false, reason: "Trending in Lagos", href: "/courses/1", accentColor: "bg-amber-50 border-amber-100" },
  { id: 5, type: "listing", title: "Honda Generator I-Power 2.2KVA", subtitle: "Ikeja, Lagos · Brand New", price: "320,000", rating: 4.6, reviewCount: 8, trustScore: 75, verified: true, reason: "Frequently bought with your watchlist", href: "/marketplace/2", accentColor: "bg-orange-50 border-orange-100" },
  { id: 6, type: "service", title: "Legal Business Registration (CAC)", subtitle: "Certified Lawyer · 5 day delivery", price: "45,000", rating: 4.9, reviewCount: 88, trustScore: 95, verified: true, reason: "Sellers like you use this service", href: "/services/2", accentColor: "bg-indigo-50 border-indigo-100" },
  { id: 7, type: "job", title: "Sales Executive (Abuja)", subtitle: "Apex Finance Ltd · Full-time", price: "180,000/mo", rating: undefined, reviewCount: undefined, trustScore: 68, verified: false, reason: "Near you · High match", href: "/jobs/2", accentColor: "bg-rose-50 border-rose-100" },
  { id: 8, type: "course", title: "Verified Exporter Certification", subtitle: "Vanguard Academy · 12 hours", price: "25,000", rating: 4.8, reviewCount: 67, trustScore: 90, verified: true, reason: "Required for Export Trust Badge", href: "/courses/2", accentColor: "bg-teal-50 border-teal-100" },
];

const FILTERS = ["All", "Products", "Services", "Jobs", "Courses"] as const;
const TYPE_MAP: Record<typeof FILTERS[number], RecommendationType | undefined> = {
  All: undefined, Products: "listing", Services: "service", Jobs: "job", Courses: "course",
};

export default function RecommendationsPage() {
  const [filter, setFilter] = useState<typeof FILTERS[number]>("All");
  const [refreshKey, setRefreshKey] = useState(0);

  const filtered = MOCK_RECOMMENDATIONS.filter((r) => {
    const t = TYPE_MAP[filter];
    return !t || r.type === t;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="h-6 w-6 text-amber-500" /> For You</h1>
          <p className="text-muted-foreground text-sm">Personalized recommendations based on your activity.</p>
        </div>
        <button onClick={() => setRefreshKey((k) => k + 1)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm hover:bg-muted transition">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="rounded-2xl border bg-card p-4 mb-6 flex gap-3 items-center">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">Your recommendation engine is active</p>
          <p className="text-xs text-muted-foreground">Updated based on searches, views, and purchase history.</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${filter === f ? "bg-primary text-primary-foreground" : "border hover:bg-muted"}`}>{f}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((rec) => {
          const tc = TYPE_CONFIG[rec.type];
          const TI = tc.icon;
          return (
            <Link key={rec.id} href={rec.href}>
              <div className={`rounded-2xl border bg-card p-4 hover:shadow-md transition cursor-pointer ${rec.accentColor}`}>
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl bg-white border flex items-center justify-center shrink-0">
                    <TI className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{tc.label}</span>
                          {rec.verified && <Shield className="h-3 w-3 text-primary" />}
                        </div>
                        <h3 className="font-semibold text-sm leading-tight">{rec.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{rec.subtitle}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                    </div>

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {rec.price && <span className="text-sm font-bold text-primary">₦{rec.price}</span>}
                      {rec.rating !== undefined && (
                        <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{rec.rating} ({rec.reviewCount})
                        </span>
                      )}
                      {rec.trustScore !== undefined && (
                        <span className="text-xs text-muted-foreground">Trust {rec.trustScore}</span>
                      )}
                    </div>

                    <div className="mt-2">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-white/60 px-2 py-0.5 rounded-full border border-white/40">
                        <Sparkles className="h-3 w-3 text-amber-400" /> {rec.reason}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-semibold">No recommendations yet</p>
            <p className="text-sm text-muted-foreground mt-1">Browse more listings to get personalized suggestions.</p>
          </div>
        )}
      </div>
    </div>
  );
}
