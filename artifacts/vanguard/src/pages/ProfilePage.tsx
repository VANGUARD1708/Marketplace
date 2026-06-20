import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { ShieldCheck, Star, Package, Briefcase, Award, Users, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Profile = { id: number; userId: number; displayName?: string; bio?: string; avatarUrl?: string; coverPhotoUrl?: string; location?: string; website?: string };
type TrustData = { userId: number; trustScore: number; badge: string };
type Review = { id: number; reviewerId: number; rating: string; comment?: string; createdAt: string };

const TABS = ["Overview", "Products", "Services", "Reviews", "Certificates", "Followers"];

export default function ProfilePage() {
  const params = useParams<{ id?: string }>();
  const userId = Number(params.id ?? 1);
  const [tab, setTab] = useState("Overview");

  const { data: profile, isLoading: loadingProfile } = useQuery({
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

  const { data: reviews = [], isLoading: loadingReviews } = useQuery({
    queryKey: ["reviews", userId],
    queryFn: () => apiFetch<Review[]>(`/reviews/${userId}`),
    enabled: tab === "Reviews",
  });

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="h-48 bg-muted relative" style={profile?.coverPhotoUrl ? { backgroundImage: `url(${profile.coverPhotoUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
        <div className="absolute -bottom-12 left-6">
          {profile?.avatarUrl
            ? <img src={profile.avatarUrl} alt="avatar" className="h-24 w-24 rounded-full border-4 border-background object-cover" />
            : <div className="h-24 w-24 rounded-full bg-secondary border-4 border-background flex items-center justify-center text-2xl font-bold text-secondary-foreground">
                {(profile?.displayName ?? "U")[0].toUpperCase()}
              </div>}
        </div>
      </div>

      <div className="pt-16 px-4 md:px-8 pb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{profile?.displayName ?? `User #${userId}`}</h1>
              {trust && trust.trustScore >= 60 && <ShieldCheck className="h-5 w-5 text-primary" />}
            </div>
            {profile?.location && <p className="text-sm text-muted-foreground">📍 {profile.location}</p>}
            {profile?.bio && <p className="text-sm text-muted-foreground mt-2 max-w-xl">{profile.bio}</p>}
            {profile?.website && <a href={profile.website} className="text-xs text-primary hover:underline" target="_blank" rel="noreferrer">{profile.website}</a>}
          </div>
          <button
            onClick={() => apiFetch(`/profiles/${userId}/follow`, { method: "POST", body: JSON.stringify({ followerId: 1 }) })}
            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
          >
            Follow
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <div className="rounded-xl border p-4 bg-card">
            <p className="text-xs text-muted-foreground">Trust Score</p>
            <p className="text-xl font-bold">{trust?.trustScore ?? "—"}</p>
            {trust?.badge && <p className="text-xs text-primary mt-0.5">{trust.badge}</p>}
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="text-xs text-muted-foreground">Followers</p>
            <p className="text-xl font-bold">{(followers as unknown[]).length}</p>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="text-xs text-muted-foreground">Following</p>
            <p className="text-xl font-bold">{(following as unknown[]).length}</p>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="text-xs text-muted-foreground">Reviews</p>
            <p className="text-xl font-bold">{(reviews as Review[]).length}</p>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="text-xs text-muted-foreground">Rating</p>
            <p className="text-xl font-bold">
              {(reviews as Review[]).length > 0
                ? `${((reviews as Review[]).reduce((s, r) => s + Number(r.rating), 0) / (reviews as Review[]).length).toFixed(1)}★`
                : "—"}
            </p>
          </div>
        </div>

        <div className="flex gap-1 mb-6 overflow-x-auto border-b">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px ${
                tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Overview" && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-xl border p-5 bg-card"><Package className="h-5 w-5 mb-3 text-muted-foreground" /><h3 className="font-semibold mb-1">Products</h3><p className="text-sm text-muted-foreground">Active marketplace listings.</p></div>
            <div className="rounded-xl border p-5 bg-card"><Briefcase className="h-5 w-5 mb-3 text-muted-foreground" /><h3 className="font-semibold mb-1">Services</h3><p className="text-sm text-muted-foreground">Professional services offered.</p></div>
            <div className="rounded-xl border p-5 bg-card"><Award className="h-5 w-5 mb-3 text-muted-foreground" /><h3 className="font-semibold mb-1">Certificates</h3><p className="text-sm text-muted-foreground">Verified credentials.</p></div>
          </div>
        )}

        {tab === "Followers" && (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">{(followers as unknown[]).length} followers</p>
          </div>
        )}

        {tab === "Reviews" && (
          <div>
            {loadingReviews && <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}
            {(reviews as Review[]).length === 0 && !loadingReviews && (
              <p className="text-center py-12 text-muted-foreground text-sm">No reviews yet.</p>
            )}
            <div className="space-y-4">
              {(reviews as Review[]).map((r) => (
                <div key={r.id} className="rounded-xl border bg-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-sm">{Number(r.rating).toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
