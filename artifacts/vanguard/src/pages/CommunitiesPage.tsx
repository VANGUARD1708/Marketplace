import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, MessageSquare, TrendingUp, Plus, Search, Shield, Lock, Globe } from "lucide-react";
import { Link } from "wouter";
import { apiFetch } from "@/lib/api";

type Community = {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  postCount: number;
  category: string;
  isPrivate: boolean;
  isJoined: boolean;
  trustRequired: number;
  coverColor: string;
};

const MOCK_COMMUNITIES: Community[] = [
  { id: 1, name: "Lagos Tech Hub", description: "Technology discussions, startup news, and innovation across Lagos.", memberCount: 4812, postCount: 1243, category: "Technology", isPrivate: false, isJoined: true, trustRequired: 0, coverColor: "from-blue-500 to-blue-700" },
  { id: 2, name: "Abuja Traders Network", description: "Verified traders in Abuja sharing deals, opportunities, and market intel.", memberCount: 2934, postCount: 876, category: "Business", isPrivate: false, isJoined: false, trustRequired: 40, coverColor: "from-emerald-500 to-emerald-700" },
  { id: 3, name: "Verified Exporters NG", description: "Nigerian exporters connecting with international buyers. Escrow-protected.", memberCount: 1205, postCount: 421, category: "Trade", isPrivate: true, isJoined: false, trustRequired: 70, coverColor: "from-amber-500 to-orange-600" },
  { id: 4, name: "Real Estate Investors", description: "Property listings, investment tips, and market analysis across Nigeria.", memberCount: 3672, postCount: 654, category: "Real Estate", isPrivate: false, isJoined: true, trustRequired: 30, coverColor: "from-purple-500 to-purple-700" },
  { id: 5, name: "Fashion & Style NG", description: "Nigerian fashion designers, buyers, and influencers in one place.", memberCount: 6841, postCount: 2103, category: "Fashion", isPrivate: false, isJoined: false, trustRequired: 0, coverColor: "from-pink-500 to-rose-600" },
  { id: 6, name: "FinTech Builders", description: "Building the future of finance in Nigeria. For developers and founders.", memberCount: 987, postCount: 312, category: "Technology", isPrivate: true, isJoined: false, trustRequired: 60, coverColor: "from-cyan-500 to-sky-700" },
  { id: 7, name: "Agriculture & Agro Trade", description: "Farm produce, equipment, and agro-business opportunities nationwide.", memberCount: 2156, postCount: 789, category: "Agriculture", isPrivate: false, isJoined: false, trustRequired: 20, coverColor: "from-lime-500 to-green-600" },
  { id: 8, name: "Freelancers & Creatives", description: "Design, writing, video, and creative services marketplace.", memberCount: 5421, postCount: 1876, category: "Services", isPrivate: false, isJoined: true, trustRequired: 0, coverColor: "from-violet-500 to-indigo-600" },
];

const CATEGORIES = ["All", "Technology", "Business", "Trade", "Real Estate", "Fashion", "Agriculture", "Services"];

const ME_TRUST = 72;

export default function CommunitiesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [tab, setTab] = useState<"discover" | "joined">("discover");
  const [communities, setCommunities] = useState(MOCK_COMMUNITIES);

  const filtered = communities.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || c.category === category;
    const matchesTab = tab === "discover" ? !c.isJoined : c.isJoined;
    return matchesSearch && matchesCategory && matchesTab;
  });

  function toggleJoin(id: number) {
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isJoined: !c.isJoined, memberCount: c.isJoined ? c.memberCount - 1 : c.memberCount + 1 } : c
      )
    );
  }

  const joined = communities.filter((c) => c.isJoined).length;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Communities</h1>
        <p className="text-muted-foreground text-sm">Connect with trusted buyers, sellers, and professionals.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Joined", value: joined, icon: Users, color: "text-primary" },
          { label: "Total Members", value: "27.8k", icon: Globe, color: "text-emerald-600" },
          { label: "Active Today", value: "1.2k", icon: TrendingUp, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card p-3 flex flex-col items-center gap-1">
            <s.icon className={`h-5 w-5 ${s.color}`} />
            <span className="text-lg font-bold">{s.value}</span>
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search communities..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${category === c ? "bg-primary text-primary-foreground" : "border hover:bg-muted"}`}>{c}</button>
        ))}
      </div>

      <div className="flex gap-1 mb-5 bg-muted rounded-xl p-1">
        {(["discover", "joined"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition ${tab === t ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((c) => {
          const canJoin = ME_TRUST >= c.trustRequired;
          return (
            <div key={c.id} className="rounded-2xl border bg-card overflow-hidden hover:shadow-md transition">
              <div className={`h-20 bg-gradient-to-br ${c.coverColor} relative flex items-end p-3`}>
                <div className="flex items-center gap-2">
                  {c.isPrivate && <Lock className="h-3.5 w-3.5 text-white/80" />}
                  <span className="text-xs text-white/80 font-medium bg-black/20 px-2 py-0.5 rounded-full">{c.category}</span>
                </div>
                {c.isJoined && <span className="absolute top-3 right-3 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">Joined</span>}
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">{c.name}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{c.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{c.memberCount.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{c.postCount.toLocaleString()} posts</span>
                  {c.trustRequired > 0 && <span className="flex items-center gap-1 text-amber-600"><Shield className="h-3.5 w-3.5" />Trust {c.trustRequired}+</span>}
                </div>
                <button
                  onClick={() => canJoin && toggleJoin(c.id)}
                  disabled={!canJoin && !c.isJoined}
                  className={`w-full py-2 rounded-xl text-sm font-medium transition ${c.isJoined ? "border hover:bg-muted" : canJoin ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
                >
                  {c.isJoined ? "Leave" : canJoin ? "Join Community" : `Requires Trust ${c.trustRequired}`}
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-16">
            <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-semibold">No communities found</p>
            <p className="text-sm text-muted-foreground mt-1">Try a different search or category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
