import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import {
  Building2, ShieldCheck, Users, Package, Briefcase, Star,
  Loader2, MapPin, Globe, Plus, CheckCircle2, ExternalLink,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

const ME = 1;

type Company = {
  id: number; ownerId: number; name: string; description?: string;
  industry?: string; location?: string; website?: string; logoUrl?: string;
  bannerUrl?: string; employeeCount?: number; isVerified: boolean; createdAt: string;
};
type CompanyStats = { products: number; services: number; reviews: number; trustScore: number; followers: number };

const TABS = ["About", "Products", "Services", "Reviews", "Team"] as const;
type Tab = (typeof TABS)[number];

export default function CompanyPage() {
  const { id } = useParams<{ id?: string }>();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("About");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", industry: "", location: "", website: "" });

  const { data: company, isLoading } = useQuery({
    queryKey: ["company", id],
    queryFn: () => apiFetch<Company>(id ? `/companies/${id}` : `/companies?ownerId=${ME}`).then((r) =>
      Array.isArray(r) ? r[0] : r
    ),
  });

  const { data: stats } = useQuery({
    queryKey: ["company-stats", company?.id],
    queryFn: () => apiFetch<CompanyStats>(`/companies/${company?.id}/stats`),
    enabled: Boolean(company?.id),
  });

  const follow = useMutation({
    mutationFn: () => apiFetch(`/companies/${company?.id}/follow`, { method: "POST", body: JSON.stringify({ userId: ME }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["company-stats", company?.id] }),
  });

  const create = useMutation({
    mutationFn: () => apiFetch("/companies", { method: "POST", body: JSON.stringify({ ...form, ownerId: ME }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["company", id] }); setShowCreate(false); },
  });

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  if (!company && !showCreate) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">No Company Yet</h2>
        <p className="text-muted-foreground mb-6">Create your company profile to list products, hire, and grow your brand.</p>
        <button onClick={() => setShowCreate(true)} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 mx-auto">
          <Plus className="h-4 w-4" /> Create Company
        </button>
      </div>
    );
  }

  if (showCreate) {
    return (
      <div className="max-w-xl mx-auto p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create Company</h1>
          <p className="text-sm text-muted-foreground">Set up your company profile on Vanguard</p>
        </div>
        <div className="space-y-4">
          {[
            { key: "name", label: "Company Name", placeholder: "e.g. Vanguard Technologies Ltd" },
            { key: "industry", label: "Industry", placeholder: "e.g. Electronics, Fashion, Real Estate" },
            { key: "location", label: "Location", placeholder: "e.g. Lagos, Nigeria" },
            { key: "website", label: "Website (optional)", placeholder: "https://yourcompany.com" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-sm font-medium block mb-1.5">{label}</label>
              <input value={form[key as keyof typeof form]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          ))}
          <div>
            <label className="text-sm font-medium block mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3} placeholder="Tell buyers what your company does..."
              className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowCreate(false)} className="flex-1 rounded-xl border py-2.5 text-sm font-medium">Cancel</button>
            <button onClick={() => create.mutate()} disabled={create.isPending || !form.name}
              className="flex-1 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
              {create.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</> : "Create Company"}
            </button>
          </div>
          {create.error && <p className="text-xs text-destructive">{(create.error as Error).message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Banner */}
      <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 relative"
        style={company?.bannerUrl ? { backgroundImage: `url(${company.bannerUrl})`, backgroundSize: "cover" } : {}}>
        <div className="absolute -bottom-10 left-6">
          <div className="h-20 w-20 rounded-2xl bg-card border-4 border-background flex items-center justify-center shadow-lg">
            {company?.logoUrl
              ? <img src={company.logoUrl} alt={company.name} className="h-full w-full object-cover rounded-xl" />
              : <Building2 className="h-9 w-9 text-muted-foreground" />
            }
          </div>
        </div>
        <div className="absolute bottom-3 right-4 flex gap-2">
          {company?.ownerId === ME && (
            <button className="px-3 py-1.5 rounded-lg bg-black/40 text-white text-xs font-medium hover:bg-black/60 transition">Edit</button>
          )}
          <button onClick={() => follow.mutate()} disabled={follow.isPending}
            className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition disabled:opacity-50">
            {follow.isPending ? "Following…" : "Follow"}
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8 pb-10">
        <div className="pt-14 mb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{company?.name}</h1>
                {company?.isVerified && <ShieldCheck className="h-5 w-5 text-primary" />}
              </div>
              {company?.industry && <p className="text-sm text-muted-foreground mb-1">{company.industry}</p>}
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                {company?.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {company.location}</span>}
                {company?.website && (
                  <a href={company.website} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline">
                    <Globe className="h-3.5 w-3.5" /> Website <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
            {company?.isVerified && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 shrink-0">
                <CheckCircle2 className="h-3.5 w-3.5" /> Verified Business
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[
            { label: "Followers", value: stats?.followers },
            { label: "Products", value: stats?.products },
            { label: "Services", value: stats?.services },
            { label: "Reviews", value: stats?.reviews },
            { label: "Trust", value: stats?.trustScore },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border bg-card p-3 text-center">
              <p className="text-lg font-bold">{value?.toLocaleString() ?? "—"}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b mb-6">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "About" && (
          <div className="max-w-2xl">
            <div className="rounded-2xl border bg-card p-5">
              <h3 className="font-semibold mb-3">About {company?.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {company?.description ?? "No description provided."}
              </p>
              <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Founded</span> · <span>{new Date(company!.createdAt).getFullYear()}</span></div>
                {company?.employeeCount && <div><Users className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />{company.employeeCount} employees</div>}
              </div>
            </div>
          </div>
        )}

        {tab === "Products" && (
          <div className="text-center py-10 text-muted-foreground">
            <Package className="h-10 w-10 mx-auto mb-3" />
            <p>Products will appear here.</p>
            <Link href="/create-listing"><button className="mt-3 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">Add Product</button></Link>
          </div>
        )}

        {tab === "Services" && (
          <div className="text-center py-10 text-muted-foreground">
            <Briefcase className="h-10 w-10 mx-auto mb-3" />
            <p>Services will appear here.</p>
          </div>
        )}

        {tab === "Reviews" && (
          <div className="text-center py-10 text-muted-foreground">
            <Star className="h-10 w-10 mx-auto mb-3" />
            <p>Customer reviews will appear here.</p>
          </div>
        )}

        {tab === "Team" && (
          <div className="text-center py-10 text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-3" />
            <p>Team members will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
