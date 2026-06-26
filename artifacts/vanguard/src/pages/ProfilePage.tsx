import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import {
  ShieldCheck, Star, Package, Briefcase, Award, Users, Loader2,
  MessageCircle, Share2, MapPin, Globe, CheckCircle2, TrendingUp,
  Settings, UserCheck, ExternalLink,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type Profile = {
  id: number; userId: number; displayName?: string; bio?: string;
  avatarUrl?: string; coverPhotoUrl?: string; location?: string; website?: string;
};
type TrustData = { userId: number; trustScore: number; level: string; badges: string[] };
type Review = { id: number; reviewerId: number; rating: string; comment?: string; createdAt: string };
type Listing = { id: number; title: string; price: string; category?: string; status: string; createdAt: string };
type Certificate = { id: number; title: string; issuer?: string; issuedAt?: string };

const TABS = ["Overview", "Products", "Reviews", "Certificates", "Followers"] as const;
type Tab = (typeof TABS)[number];

function TrustBadge({ badge }: { badge: string }) {
  const badges: Record<string, { label: string; color: string }> = {
    verified_user: { label: "Verified", color: "bg-blue-100 text-blue-700" },
    trusted_seller: { label: "Trusted Seller", color: "bg-emerald-100 text-emerald-700" },
    top_rated: { label: "Top Rated", color: "bg-amber-100 text-amber-700" },
    guardian_protected: { label: "Guardian", color: "bg-purple-100 text-purple-700" },
    verified_company: { label: "Verified Company", color: "bg-indigo-100 text-indigo-700" },
  };
  const b = badges[badge];
  if (!b) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${b.color}`}>
      <CheckCircle2 className="h-3 w-3" /> {b.label}
    </span>
  );
}

function TrustRing({ score }: { score: number }) {
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#3b82f6" : score >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="absolute" width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${(score / 100) * 339.3} 339.3`}
          strokeLinecap="round" transform="rotate(-90 60 60)" />
      </svg>
    </div>
  );
}

export default function ProfilePage() {
  const params = useParams<{ id?: string }>();
  const userId = Number(params.id ?? 1);
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("Overview");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => apiFetch<Profile>(`/profiles/${userId}`),
  });

  const { data: trust } = useQuery({
    queryKey: ["trust", userId],
    queryFn: () => apiFetch<TrustData>(`/trust/${userId}`),
  });

  const { data: followers = [] } = useQuery({
    queryKey: ["followers", userId],
    queryFn: () => apiFetch<unknown[]>(`/profiles/${userId}/followers`),
  });

  const { data: following = [] } = useQuery({
    queryKey: ["following", userId],
    queryFn: () => apiFetch<unknown[]>(`/profiles/${userId}/following`),
  });

  const { data: listings = [], isLoading: loadingListings } = useQuery({
    queryKey: ["user-listings", userId],
    queryFn: () => apiFetch<Listing[]>(`/marketplace/listings?sellerId=${userId}`),
    enabled: tab === "Products" || tab === "Overview",
  });

  const { data: reviews = [], isLoading: loadingReviews } = useQuery({
    queryKey: ["reviews", userId],
    queryFn: () => apiFetch<Review[]>(`/reviews/${userId}`),
    enabled: tab === "Reviews",
  });

  const { data: certs = [] } = useQuery({
    queryKey: ["certs", userId],
    queryFn: () => apiFetch<Certificate[]>(`/profiles/${userId}/certificates`),
    enabled: tab === "Certificates",
  });

  const follow = useMutation({
    mutationFn: () => apiFetch(`/profiles/${userId}/follow`, { method: "POST", body: JSON.stringify({ followerId: 1 }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["followers", userId] }),
  });

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + Number(r.rating), 0) / reviews.length).toFixed(1)
    : null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const displayName = profile?.displayName ?? `User #${userId}`;
  const initials = displayName[0].toUpperCase();

  return (
    <div>
      {/* Cover Photo */}
      <div className="h-52 bg-gradient-to-br from-primary/20 to-primary/5 relative"
        style={profile?.coverPhotoUrl ? {
          backgroundImage: `url(${profile.coverPhotoUrl})`,
          backgroundSize: "cover", backgroundPosition: "center",
        } : {}}>
        <div className="absolute -bottom-14 left-6">
          {profile?.avatarUrl ? (
            <img src={profile.avatarUrl} alt="avatar"
              className="h-28 w-28 rounded-full border-4 border-background object-cover shadow-lg" />
          ) : (
            <div className="h-28 w-28 rounded-full bg-primary border-4 border-background flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg">
              {initials}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 md:px-8 pb-10">
        {/* Action buttons */}
        <div className="flex justify-end gap-2 pt-3 pb-16">
          <button
            onClick={() => follow.mutate()}
            disabled={follow.isPending}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
          >
            {follow.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Follow"}
          </button>
          <Link href="/chat">
            <button className="px-4 py-2 rounded-xl border text-sm font-medium flex items-center gap-2">
              <MessageCircle className="h-4 w-4" /> Message
            </button>
          </Link>
          <button className="px-4 py-2 rounded-xl border text-sm font-medium flex items-center gap-2">
            <Share2 className="h-4 w-4" /> Share
          </button>
          <button className="px-4 py-2 rounded-xl border text-sm font-medium">
            <Settings className="h-4 w-4" />
          </button>
        </div>

        {/* Name + Info */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{displayName}</h1>
              {trust && trust.trustScore >= 60 && (
                <ShieldCheck className="h-5 w-5 text-primary" />
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {trust?.badges.map((b) => <TrustBadge key={b} badge={b.toLowerCase().replace(/ /g, "_")} />)}
            </div>

            {profile?.location && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                <MapPin className="h-3.5 w-3.5" /> {profile.location}
              </p>
            )}
            {profile?.bio && <p className="text-sm text-muted-foreground max-w-2xl mb-2">{profile.bio}</p>}
            {profile?.website && (
              <a href={profile.website} target="_blank" rel="noreferrer"
                className="text-primary text-sm hover:underline flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" /> {profile.website} <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {/* Trust Score Card */}
          {trust && (
            <div className="flex-shrink-0 rounded-2xl border bg-card p-5 flex items-center gap-5">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <TrustRing score={trust.trustScore} />
                <div className="absolute text-center">
                  <p className="text-xl font-bold leading-none">{trust.trustScore}</p>
                  <p className="text-[10px] text-muted-foreground">Score</p>
                </div>
              </div>
              <div>
                <p className="font-semibold">{trust.level}</p>
                <p className="text-xs text-muted-foreground mb-2">Trust Level</p>
                <div className="flex flex-col gap-1">
                  {trust.badges.slice(0, 3).map((b) => (
                    <span key={b} className="text-xs text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: "Followers", value: followers.length, icon: Users },
            { label: "Following", value: following.length, icon: UserCheck },
            { label: "Listings", value: listings.length, icon: Package },
            { label: "Reviews", value: reviews.length || "—", icon: Star },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl border bg-card p-3 text-center">
              <Icon className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto border-b mb-6">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === "Overview" && (
          <div className="space-y-6">
            {avgRating && (
              <div className="rounded-2xl border bg-card p-5 flex items-center gap-4">
                <div className="text-4xl font-bold text-amber-500">{avgRating}</div>
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className={`h-4 w-4 ${s <= Math.round(Number(avgRating)) ? "text-amber-400 fill-amber-400" : "text-muted"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{reviews.length} reviews</p>
                </div>
              </div>
            )}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Package className="h-4 w-4" /> Recent Listings</h3>
              {loadingListings && <div className="py-6 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}
              {listings.length === 0 && !loadingListings && (
                <p className="text-sm text-muted-foreground text-center py-8">No listings yet.</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {listings.slice(0, 4).map((l) => (
                  <Link key={l.id} href={`/marketplace/${l.id}`}>
                    <div className="rounded-xl border p-4 hover:shadow-md transition cursor-pointer">
                      <h4 className="font-medium text-sm mb-1 truncate">{l.title}</h4>
                      <p className="text-primary font-bold">₦{Number(l.price).toLocaleString()}</p>
                      {l.category && <span className="text-xs text-muted-foreground">{l.category}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "Products" && (
          <div>
            {loadingListings && <div className="py-8 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}
            {listings.length === 0 && !loadingListings && (
              <div className="text-center py-12">
                <Package className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium">No products listed yet.</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((l) => (
                <Link key={l.id} href={`/marketplace/${l.id}`}>
                  <div className="rounded-2xl border overflow-hidden hover:shadow-lg transition cursor-pointer">
                    <div className="h-40 bg-muted flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold mb-1 truncate">{l.title}</h4>
                      <p className="text-xl font-bold text-primary">₦{Number(l.price).toLocaleString()}</p>
                      {l.category && <span className="text-xs border px-2 py-0.5 rounded-full">{l.category}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {tab === "Reviews" && (
          <div className="space-y-4">
            {loadingReviews && <div className="py-6 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}
            {reviews.length === 0 && !loadingReviews && (
              <div className="text-center py-12">
                <Star className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium">No reviews yet.</p>
              </div>
            )}
            {reviews.map((r) => (
              <div key={r.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                    {r.reviewerId}
                  </div>
                  <div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`h-3.5 w-3.5 ${s <= Number(r.rating) ? "text-amber-400 fill-amber-400" : "text-muted"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {r.comment && <p className="text-sm">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}

        {tab === "Certificates" && (
          <div className="space-y-3">
            {certs.length === 0 && (
              <div className="text-center py-12">
                <Award className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium">No certificates yet.</p>
              </div>
            )}
            {certs.map((c) => (
              <div key={c.id} className="rounded-xl border bg-card p-4 flex items-center gap-4">
                <Award className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <p className="font-medium">{c.title}</p>
                  {c.issuer && <p className="text-sm text-muted-foreground">{c.issuer}</p>}
                  {c.issuedAt && <p className="text-xs text-muted-foreground">{new Date(c.issuedAt).toLocaleDateString()}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Followers" && (
          <div className="space-y-3">
            {followers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium">No followers yet.</p>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(followers as { id: number; username?: string }[]).map((f, i) => (
                <Link key={f.id ?? i} href={`/profile/${f.id}`}>
                  <div className="rounded-xl border bg-card p-3 flex items-center gap-3 hover:shadow-md transition cursor-pointer">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold shrink-0">
                      {(f.username ?? "U")[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{f.username ?? `User #${f.id}`}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
