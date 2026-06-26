import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, MessageSquare, TrendingUp, Plus, Search, Shield, Lock, Globe, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { apiFetch, getToken } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type Community = {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  isPrivate: boolean;
  isJoined: boolean;
  trustRequired: number;
  coverColor: string;
};

const CATEGORIES = ["All", "Technology", "Business", "Trade", "Real Estate", "Fashion", "Agriculture", "Services", "General"];

const COVER_COLORS = [
  "from-blue-500 to-blue-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-orange-600",
  "from-purple-500 to-purple-700",
  "from-pink-500 to-rose-600",
  "from-cyan-500 to-sky-700",
  "from-lime-500 to-green-600",
  "from-violet-500 to-indigo-600",
];

export default function CommunitiesPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [tab, setTab] = useState<"discover" | "joined">("discover");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [newPrivate, setNewPrivate] = useState(false);

  const isLoggedIn = Boolean(getToken());

  const { data: communities = [], isLoading } = useQuery<Community[]>({
    queryKey: ["communities"],
    queryFn: () => apiFetch<Community[]>("/communities"),
  });

  const joinMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/communities/${id}/join`, { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["communities"] });
      toast({ title: "Joined community!" });
    },
    onError: () => toast({ title: "Failed to join", variant: "destructive" }),
  });

  const leaveMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/communities/${id}/leave`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["communities"] });
      toast({ title: "Left community" });
    },
    onError: () => toast({ title: "Failed to leave", variant: "destructive" }),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      apiFetch("/communities", {
        method: "POST",
        body: JSON.stringify({
          name: newName,
          description: newDesc,
          category: newCategory,
          isPrivate: newPrivate,
          coverColor: COVER_COLORS[Math.floor(Math.random() * COVER_COLORS.length)],
        }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["communities"] });
      setShowCreate(false);
      setNewName("");
      setNewDesc("");
      setNewCategory("General");
      setNewPrivate(false);
      toast({ title: "Community created!" });
    },
    onError: () => toast({ title: "Failed to create community", variant: "destructive" }),
  });

  const filtered = communities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || c.category === category;
    const matchesTab = tab === "discover" ? !c.isJoined : c.isJoined;
    return matchesSearch && matchesCategory && matchesTab;
  });

  const joined = communities.filter((c) => c.isJoined).length;
  const totalMembers = communities.reduce((acc, c) => acc + c.memberCount, 0);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Communities</h1>
          <p className="text-muted-foreground text-sm">Connect with trusted buyers, sellers, and professionals.</p>
        </div>
        {isLoggedIn && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition"
          >
            <Plus className="h-4 w-4" />
            Create
          </button>
        )}
      </div>

      {showCreate && (
        <div className="rounded-2xl border bg-card p-5 mb-6">
          <h2 className="font-semibold mb-4">Create Community</h2>
          <div className="space-y-3">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Community name"
              className="w-full px-3 py-2 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Description..."
              rows={3}
              className="w-full px-3 py-2 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            <div className="flex gap-3">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border bg-background text-sm outline-none"
              >
                {CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPrivate}
                  onChange={(e) => setNewPrivate(e.target.checked)}
                  className="rounded"
                />
                Private
              </label>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 rounded-xl border text-sm hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                disabled={!newName.trim() || !newDesc.trim() || createMutation.isPending}
                onClick={() => createMutation.mutate()}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition"
              >
                {createMutation.isPending ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Joined", value: joined, icon: Users, color: "text-primary" },
          { label: "Total Members", value: totalMembers > 999 ? `${(totalMembers / 1000).toFixed(1)}k` : totalMembers, icon: Globe, color: "text-emerald-600" },
          { label: "Communities", value: communities.length, icon: TrendingUp, color: "text-amber-600" },
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
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search communities..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${category === c ? "bg-primary text-primary-foreground" : "border hover:bg-muted"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex gap-1 mb-5 bg-muted rounded-xl p-1">
        {(["discover", "joined"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition ${tab === t ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((c) => (
          <div key={c.id} className="rounded-2xl border bg-card overflow-hidden hover:shadow-md transition">
            <Link href={`/communities/${c.id}`}>
              <div className={`h-20 bg-gradient-to-br ${c.coverColor} relative flex items-end p-3 cursor-pointer`}>
                <div className="flex items-center gap-2">
                  {c.isPrivate && <Lock className="h-3.5 w-3.5 text-white/80" />}
                  <span className="text-xs text-white/80 font-medium bg-black/20 px-2 py-0.5 rounded-full">{c.category}</span>
                </div>
                {c.isJoined && (
                  <span className="absolute top-3 right-3 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">Joined</span>
                )}
              </div>
            </Link>
            <div className="p-4">
              <Link href={`/communities/${c.id}`}>
                <h3 className="font-semibold mb-1 hover:text-primary cursor-pointer">{c.name}</h3>
              </Link>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{c.description}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {c.memberCount.toLocaleString()}
                </span>
                {c.trustRequired > 0 && (
                  <span className="flex items-center gap-1 text-amber-600">
                    <Shield className="h-3.5 w-3.5" />
                    Trust {c.trustRequired}+
                  </span>
                )}
              </div>
              {isLoggedIn ? (
                <button
                  onClick={() => (c.isJoined ? leaveMutation.mutate(c.id) : joinMutation.mutate(c.id))}
                  disabled={joinMutation.isPending || leaveMutation.isPending}
                  className={`w-full py-2 rounded-xl text-sm font-medium transition ${
                    c.isJoined
                      ? "border hover:bg-muted"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  } disabled:opacity-50`}
                >
                  {c.isJoined ? "Leave" : "Join Community"}
                </button>
              ) : (
                <Link href="/auth/login">
                  <button className="w-full py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition">
                    Sign in to Join
                  </button>
                </Link>
              )}
            </div>
          </div>
        ))}

        {!isLoading && filtered.length === 0 && (
          <div className="col-span-2 text-center py-16">
            <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-semibold">No communities found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {tab === "joined" ? "You haven't joined any communities yet." : "Try a different search or category."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
