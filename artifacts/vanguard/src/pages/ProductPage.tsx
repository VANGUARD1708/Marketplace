import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import {
  ShieldCheck, MessageCircle, Bookmark, Share2, Heart, Star,
  Loader2, Package, AlertTriangle, ChevronLeft, Lock, CheckCircle2,
  Eye, ArrowRight,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

const ME = 1;

type Listing = {
  id: number; sellerId: number; title: string; description?: string;
  price: string; category?: string; condition?: string; status: string;
  mediaUrls?: string[]; location?: string; createdAt: string;
};
type TrustData = { trustScore: number; level: string; badges: string[] };

function TrustBadge({ badge }: { badge: string }) {
  const map: Record<string, string> = {
    verified_user: "✓ Verified",
    trusted_seller: "🛡 Trusted Seller",
    top_rated: "⭐ Top Rated",
    guardian_protected: "🔰 Guardian",
  };
  const label = map[badge.toLowerCase().replace(/ /g, "_")];
  if (!label) return null;
  return (
    <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">{label}</span>
  );
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => apiFetch<Listing>(`/marketplace/listings/${id}`),
    enabled: Boolean(id),
  });

  const { data: trust } = useQuery({
    queryKey: ["trust", listing?.sellerId],
    queryFn: () => apiFetch<TrustData>(`/trust/${listing?.sellerId}`),
    enabled: Boolean(listing?.sellerId),
  });

  const createEscrow = useMutation({
    mutationFn: () => apiFetch("/escrow", {
      method: "POST",
      body: JSON.stringify({ buyerId: ME, sellerId: listing?.sellerId, listingId: listing?.id, amount: listing?.price }),
    }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["escrows"] }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="p-8 text-center">
        <Package className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
        <p className="font-medium">Listing not found</p>
        <Link href="/marketplace"><button className="mt-3 text-primary text-sm hover:underline">← Back to Marketplace</button></Link>
      </div>
    );
  }

  const images = listing.mediaUrls?.length ? listing.mediaUrls : [];
  const priceNum = Number(listing.price);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
        <Link href="/marketplace"><span className="hover:text-foreground cursor-pointer flex items-center gap-1"><ChevronLeft className="h-4 w-4" /> Marketplace</span></Link>
        {listing.category && <><span>/</span><span>{listing.category}</span></>}
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-xs">{listing.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Images */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl bg-muted h-80 md:h-96 flex items-center justify-center overflow-hidden mb-3 relative">
            {images.length > 0 ? (
              <img src={images[activeImg]} alt={listing.title} className="h-full w-full object-cover" />
            ) : (
              <div className="text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No photos</p>
              </div>
            )}
            {/* Guardian badge overlay */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="bg-black/60 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Guardian Protected
              </span>
            </div>
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`h-16 w-16 rounded-xl overflow-hidden shrink-0 border-2 ${i === activeImg ? "border-primary" : "border-transparent"}`}>
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="rounded-2xl border bg-card p-5 mt-5">
            <h3 className="font-semibold mb-3">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {listing.description ?? "No description provided."}
            </p>
          </div>
        </div>

        {/* Right: Details + Actions */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
            <div className="flex flex-wrap gap-2 mb-3">
              {listing.category && <span className="text-xs border px-2.5 py-1 rounded-full">{listing.category}</span>}
              {listing.condition && <span className="text-xs border px-2.5 py-1 rounded-full">{listing.condition}</span>}
              {listing.location && <span className="text-xs border px-2.5 py-1 rounded-full">📍 {listing.location}</span>}
            </div>
            <p className="text-3xl font-bold text-primary">₦{priceNum.toLocaleString()}</p>
          </div>

          {/* Stats row */}
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> 320 views</span>
            <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> 45 saves</span>
          </div>

          {/* Seller card */}
          <Link href={`/profile/${listing.sellerId}`}>
            <div className="rounded-2xl border bg-card p-4 flex items-center gap-3 hover:shadow-md transition cursor-pointer">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                {listing.sellerId}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">Seller #{listing.sellerId}</p>
                {trust && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-muted-foreground">Trust {trust.trustScore} · {trust.level}</span>
                  </div>
                )}
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>
          </Link>

          {trust?.badges.length ? (
            <div className="flex flex-wrap gap-1.5">
              {trust.badges.map((b) => <TrustBadge key={b} badge={b} />)}
            </div>
          ) : null}

          {/* Escrow info */}
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 flex items-start gap-2">
            <Lock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Escrow Protected</span> — your payment is held safely until you confirm receipt.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={() => createEscrow.mutate()}
              disabled={createEscrow.isPending || listing.status !== "active"}
              className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
              {createEscrow.isPending
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
                : <><Lock className="h-4 w-4" /> Buy with Escrow</>}
            </button>
            {createEscrow.isSuccess && (
              <p className="text-xs text-emerald-600 text-center flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Escrow created! Check your Escrow Center.
              </p>
            )}
            <Link href="/chat">
              <button className="w-full rounded-xl border py-2.5 font-medium flex items-center justify-center gap-2 hover:bg-muted transition">
                <MessageCircle className="h-4 w-4" /> Chat Seller
              </button>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setSaved(!saved)}
                className={`rounded-xl border py-2.5 flex items-center justify-center gap-2 text-sm transition ${saved ? "bg-primary/10 border-primary text-primary" : "hover:bg-muted"}`}>
                <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
                {saved ? "Saved" : "Save"}
              </button>
              <button onClick={() => setLiked(!liked)}
                className={`rounded-xl border py-2.5 flex items-center justify-center gap-2 text-sm transition ${liked ? "bg-red-50 border-red-300 text-red-600" : "hover:bg-muted"}`}>
                <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} /> Like
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="rounded-xl border py-2.5 flex items-center justify-center gap-2 text-sm hover:bg-muted transition">
                <Share2 className="h-4 w-4" /> Share
              </button>
              <button className="rounded-xl border py-2.5 flex items-center justify-center gap-2 text-sm text-red-600 border-red-200 hover:bg-red-50 transition">
                <AlertTriangle className="h-4 w-4" /> Report
              </button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Listed {new Date(listing.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
