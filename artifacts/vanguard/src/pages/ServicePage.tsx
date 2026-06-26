import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import {
  Briefcase, Star, ShieldCheck, MessageCircle, Bookmark, Share2,
  Loader2, ChevronLeft, CheckCircle2, Lock, Clock, MapPin, ArrowRight,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

const ME = 1;

type Service = {
  id: number; providerId: number; title: string; description?: string;
  category?: string; deliveryTime?: string; price: string; location?: string;
  status: string; createdAt: string;
};
type TrustData = { trustScore: number; level: string; badges: string[] };

export default function ServicePage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();

  const { data: service, isLoading, error } = useQuery({
    queryKey: ["service", id],
    queryFn: () => apiFetch<Service>(`/services/${id}`),
    enabled: Boolean(id),
  });

  const { data: trust } = useQuery({
    queryKey: ["trust", service?.providerId],
    queryFn: () => apiFetch<TrustData>(`/trust/${service?.providerId}`),
    enabled: Boolean(service?.providerId),
  });

  const hire = useMutation({
    mutationFn: () => apiFetch("/escrow", {
      method: "POST",
      body: JSON.stringify({ buyerId: ME, sellerId: service?.providerId, amount: service?.price }),
    }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["escrows"] }),
  });

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  if (error || !service) {
    return (
      <div className="p-8 text-center">
        <Briefcase className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <p className="font-medium">Service not found</p>
        <Link href="/services"><button className="mt-3 text-primary text-sm hover:underline">← Back to Services</button></Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
        <Link href="/services"><span className="hover:text-foreground cursor-pointer flex items-center gap-1"><ChevronLeft className="h-4 w-4" /> Services</span></Link>
        {service.category && <><span>/</span><span>{service.category}</span></>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Service banner */}
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 h-48 flex items-center justify-center relative overflow-hidden">
            <Briefcase className="h-16 w-16 text-primary/30" />
            {service.category && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 text-white">
                {service.category}
              </span>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">{service.title}</h1>
            <div className="flex flex-wrap gap-2 mb-3">
              {service.deliveryTime && (
                <span className="flex items-center gap-1 text-xs border px-2.5 py-1 rounded-full">
                  <Clock className="h-3 w-3" /> {service.deliveryTime}
                </span>
              )}
              {service.location && (
                <span className="flex items-center gap-1 text-xs border px-2.5 py-1 rounded-full">
                  <MapPin className="h-3 w-3" /> {service.location}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs border px-2.5 py-1 rounded-full">
                <ShieldCheck className="h-3 w-3 text-primary" /> Guardian Protected
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="font-semibold mb-3">About this service</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {service.description ?? "No description provided."}
            </p>
          </div>

          {/* What's included */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="font-semibold mb-3">What's included</h3>
            <div className="space-y-2 text-sm">
              {["Professional delivery", "Revisions upon request", "Guardian-protected payment", "Direct communication with provider"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4 shrink-0" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Pricing card */}
          <div className="rounded-2xl border bg-card p-5 sticky top-4">
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-1">Starting at</p>
              <p className="text-3xl font-bold text-primary">₦{Number(service.price).toLocaleString()}</p>
            </div>

            {/* Provider */}
            <Link href={`/profile/${service.providerId}`}>
              <div className="rounded-xl border p-3 flex items-center gap-3 hover:shadow-md transition cursor-pointer mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                  {service.providerId}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">Provider #{service.providerId}</p>
                  {trust && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-muted-foreground">Trust {trust.trustScore}</span>
                    </div>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>

            {/* Escrow notice */}
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 mb-4 flex items-start gap-2">
              <Lock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Escrow Protection</span> — payment held until you're satisfied.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => hire.mutate()}
                disabled={hire.isPending || service.status !== "active"}
                className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                {hire.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Booking…</> : "Hire Now"}
              </button>
              {hire.isSuccess && (
                <p className="text-xs text-emerald-600 text-center">✓ Escrow created! Check Escrow Center.</p>
              )}
              <Link href="/chat">
                <button className="w-full rounded-xl border py-2.5 flex items-center justify-center gap-2 text-sm hover:bg-muted transition">
                  <MessageCircle className="h-4 w-4" /> Contact Provider
                </button>
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <button className="rounded-xl border py-2 flex items-center justify-center gap-1.5 text-sm hover:bg-muted transition">
                  <Bookmark className="h-4 w-4" /> Save
                </button>
                <button className="rounded-xl border py-2 flex items-center justify-center gap-1.5 text-sm hover:bg-muted transition">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
