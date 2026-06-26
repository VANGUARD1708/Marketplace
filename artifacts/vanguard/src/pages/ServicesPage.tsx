import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Wrench, Search, Star, Shield, Loader2, SlidersHorizontal,
  Clock, MapPin, CheckCircle2, Plus,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type Service = {
  id: number; providerId: number; title: string; description?: string;
  category?: string; deliveryTime?: string; price: string; location?: string; status: string; createdAt: string;
};

const CATEGORIES = ["All", "Design", "Development", "Marketing", "Writing", "Video", "Audio", "Finance", "Legal", "Other"];

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ["services"],
    queryFn: () => apiFetch<Service[]>("/services"),
  });

  const filtered = services.filter((s) => {
    const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || s.category === category;
    return matchSearch && matchCat && s.status === "active";
  });

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-sm text-muted-foreground">Hire verified professionals on Vanguard</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2">
          <Plus className="h-4 w-4" /> Offer Service
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Active Services", value: services.filter((s) => s.status === "active").length },
          { label: "Verified Providers", value: services.length, sub: "Guardian-screened" },
          { label: "Categories", value: CATEGORIES.length - 1 },
        ].map(({ label, value, sub }) => (
          <div key={label} className="rounded-xl border bg-card p-3 text-center">
            <p className="text-lg font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{sub ?? label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full rounded-xl border bg-card pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <button className="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm hover:bg-muted transition">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
              category === c ? "bg-primary text-primary-foreground" : "border hover:bg-muted"
            }`}>
            {c}
          </button>
        ))}
      </div>

      {isLoading && <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive mb-4">{String(error)}</div>
      )}

      {filtered.length === 0 && !isLoading && (
        <div className="text-center py-12 border rounded-2xl bg-card">
          <Wrench className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium">No services found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or offer a service yourself.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((service) => (
          <Link key={service.id} href={`/services/${service.id}`}>
            <div className="rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition cursor-pointer">
              {/* Service banner */}
              <div className="h-36 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
                <Wrench className="h-12 w-12 text-primary/30" />
                {service.category && (
                  <span className="absolute top-2 left-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full">{service.category}</span>
                )}
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-full">
                  <Shield className="h-2.5 w-2.5" /> Verified
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{service.title}</h3>
                {service.description && (
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{service.description}</p>
                )}

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                  {service.deliveryTime && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {service.deliveryTime}</span>}
                  {service.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {service.location}</span>}
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map((s) => <Star key={s} className="h-3 w-3 text-amber-400 fill-amber-400" />)}
                  <span className="text-xs text-muted-foreground">(4.8)</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Starting at</p>
                    <p className="text-primary font-bold">₦{Number(service.price).toLocaleString()}</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">Hire</button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
