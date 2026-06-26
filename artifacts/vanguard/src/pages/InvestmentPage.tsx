import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TrendingUp, DollarSign, Users, Clock, Shield, ChevronRight,
  Search, BarChart2, Building2, Loader2, Wallet, PieChart, ArrowLeft,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type Investment = {
  id: number;
  title: string;
  company: string;
  sector: string;
  description: string | null;
  targetAmount: number;
  raisedAmount: number;
  minInvestment: number;
  projectedReturn: number;
  duration: number;
  investorCount: number;
  risk: "low" | "medium" | "high";
  verified: boolean;
  status: string;
  closingDate: string | null;
};

type Stats = { totalRaised: number; avgReturn: number; activeDeals: number };
type ListResponse = { investments: Investment[]; stats: Stats };

type PortfolioItem = {
  commitmentId: number;
  investmentId: number;
  title: string;
  company: string;
  sector: string;
  amount: number;
  projectedReturn: number;
  durationMonths: number;
  status: string;
  investmentStatus: string;
  closingDate: string | null;
  committedAt: string;
};

type Portfolio = { portfolio: PortfolioItem[]; totalInvested: number; projectedReturns: number };

const SECTORS = ["All", "Agriculture", "FinTech", "Energy", "Real Estate", "Education", "Logistics", "Healthcare", "Technology"];

const RISK_CONFIG = {
  low: { label: "Low Risk", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  medium: { label: "Medium Risk", color: "text-amber-600 bg-amber-50 border-amber-200" },
  high: { label: "High Risk", color: "text-red-600 bg-red-50 border-red-200" },
};

function fmt(n: number) { return `₦${(n / 1_000_000).toFixed(1)}M`; }
function fmtFull(n: number) { return `₦${n.toLocaleString()}`; }

function daysLeft(date: string | null) {
  if (!date) return null;
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
}

type View = "list" | "detail" | "portfolio";

export default function InvestmentPage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const [view, setView] = useState<View>("list");
  const [selected, setSelected] = useState<Investment | null>(null);
  const [commitAmount, setCommitAmount] = useState("");
  const [commitSuccess, setCommitSuccess] = useState(false);

  const params = new URLSearchParams({ status: "active" });
  if (search) params.set("search", search);
  if (sector !== "All") params.set("sector", sector);

  const { data, isLoading, error } = useQuery<ListResponse>({
    queryKey: ["investments", search, sector],
    queryFn: () => apiFetch<ListResponse>(`/investments?${params}`),
  });

  const { data: portfolioData, isLoading: loadingPortfolio, error: portfolioError } = useQuery<Portfolio>({
    queryKey: ["investments-portfolio", user?.id],
    queryFn: () => apiFetch<Portfolio>(`/investments/portfolio`),
    enabled: view === "portfolio" && !!user,
  });

  const commitMutation = useMutation({
    mutationFn: ({ investmentId, amount }: { investmentId: number; amount: number }) =>
      apiFetch(`/investments/${investmentId}/commit`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["investments"] });
      qc.invalidateQueries({ queryKey: ["investments-portfolio"] });
      setCommitSuccess(true);
      setCommitAmount("");
    },
  });

  const investments = data?.investments ?? [];
  const stats = data?.stats;

  if (view === "portfolio") {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <button onClick={() => setView("list")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Investments
        </button>
        <h1 className="text-2xl font-bold mb-1">My Portfolio</h1>
        <p className="text-muted-foreground text-sm mb-6">Track your committed investments and projected returns.</p>

        {!user ? (
          <div className="text-center py-16 text-muted-foreground">
            <Wallet className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="font-semibold">Sign in to view your portfolio</p>
            <p className="text-sm mt-1">Log in to see your committed investments and projected returns.</p>
          </div>
        ) : portfolioError ? (
          <div className="text-center py-16 text-destructive">
            <p className="font-semibold">Failed to load portfolio</p>
            <p className="text-sm mt-1 text-muted-foreground">Please try again later.</p>
          </div>
        ) : loadingPortfolio ? (
          <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading portfolio…
          </div>
        ) : portfolioData ? (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-2xl border bg-card p-4 flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">Total Invested</p>
                <p className="text-xl font-bold text-primary">{fmtFull(portfolioData.totalInvested)}</p>
              </div>
              <div className="rounded-2xl border bg-card p-4 flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">Projected Returns</p>
                <p className="text-xl font-bold text-emerald-600">{fmtFull(portfolioData.projectedReturns)}</p>
              </div>
            </div>

            {portfolioData.portfolio.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <PieChart className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="font-semibold">No investments yet</p>
                <p className="text-sm mt-1">Browse opportunities and commit your first investment.</p>
                <button onClick={() => setView("list")} className="mt-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
                  Browse Investments
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {portfolioData.portfolio.map((item) => (
                  <div key={item.commitmentId} className="rounded-2xl border bg-card p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary text-sm">
                        {item.company[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.company} · {item.sector}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${item.status === "held" ? "text-amber-600 bg-amber-50 border-amber-200" : "text-emerald-600 bg-emerald-50 border-emerald-200"}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="rounded-lg bg-muted/40 p-2">
                        <p className="text-xs text-muted-foreground">Invested</p>
                        <p className="font-semibold text-xs mt-0.5">{fmtFull(item.amount)}</p>
                      </div>
                      <div className="rounded-lg bg-muted/40 p-2">
                        <p className="text-xs text-muted-foreground">Return Rate</p>
                        <p className="font-semibold text-xs mt-0.5">{item.projectedReturn}% p.a.</p>
                      </div>
                      <div className="rounded-lg bg-muted/40 p-2">
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="font-semibold text-xs mt-0.5">{item.durationMonths}mo</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
    );
  }

  if (view === "detail" && selected) {
    const pct = Math.min(100, Math.round((selected.raisedAmount / selected.targetAmount) * 100));
    const rc = RISK_CONFIG[selected.risk] ?? RISK_CONFIG.medium;
    const dl = daysLeft(selected.closingDate);
    const minAmt = selected.minInvestment;

    return (
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <button onClick={() => { setView("list"); setCommitSuccess(false); setCommitAmount(""); }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Investments
        </button>

        <div className="rounded-2xl border bg-card overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Building2 className="h-12 w-12 text-primary/40" />
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h1 className="text-xl font-bold">{selected.title}</h1>
                <p className="text-muted-foreground text-sm">{selected.company} · {selected.sector}</p>
              </div>
              {selected.verified && (
                <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full shrink-0">
                  <Shield className="h-3 w-3" />Verified
                </span>
              )}
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${rc.color} mb-4 inline-block`}>{rc.label}</span>
            <p className="text-sm text-muted-foreground mb-5">{selected.description}</p>

            <div className="mb-5">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium">{fmtFull(selected.raisedAmount)} raised</span>
                <span className="text-muted-foreground">{pct}% of {fmt(selected.targetAmount)}</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: "Projected Return", value: `${selected.projectedReturn}% p.a.` },
                { label: "Duration", value: `${selected.duration} months` },
                { label: "Min Investment", value: fmtFull(minAmt) },
                { label: "Investors", value: selected.investorCount },
                { label: "Closing Date", value: selected.closingDate ? new Date(selected.closingDate).toLocaleDateString() : "Open" },
                { label: "Days Left", value: dl !== null ? (dl > 0 ? `${dl} days` : "Closed") : "—" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">{s.label}</p>
                  <p className="font-semibold text-sm">{s.value}</p>
                </div>
              ))}
            </div>

            {commitSuccess ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 text-center text-sm font-medium mb-2">
                ✅ Investment committed! Funds are held in escrow.
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium">Commit Investment</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₦</span>
                    <input
                      type="number"
                      value={commitAmount}
                      onChange={(e) => setCommitAmount(e.target.value)}
                      placeholder={minAmt.toLocaleString()}
                      min={minAmt}
                      className="w-full pl-7 pr-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <button
                    disabled={commitMutation.isPending || !commitAmount || Number(commitAmount) < minAmt}
                    onClick={() => commitMutation.mutate({ investmentId: selected.id, amount: Number(commitAmount) })}
                    className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition flex items-center gap-2"
                  >
                    {commitMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                    Invest
                  </button>
                </div>
                {commitMutation.isError && (
                  <p className="text-xs text-destructive">{(commitMutation.error as Error).message}</p>
                )}
                {Number(commitAmount) > 0 && Number(commitAmount) < minAmt && (
                  <p className="text-xs text-amber-600">Minimum investment is {fmtFull(minAmt)}</p>
                )}
              </div>
            )}

            <p className="text-xs text-center text-muted-foreground mt-4">All investments are escrow-protected via Vanguard</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Investment Opportunities</h1>
          <p className="text-muted-foreground text-sm">Verified investment opportunities with escrow-protected returns.</p>
        </div>
        <button
          onClick={() => setView("portfolio")}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-card text-sm font-medium hover:bg-muted transition"
        >
          <Wallet className="h-4 w-4" /> My Portfolio
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading investments…
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive mb-4">
          {(error as Error).message}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Total Raised", value: stats ? fmt(stats.totalRaised) : "—", icon: DollarSign, color: "text-primary" },
              { label: "Avg Return", value: stats ? `${stats.avgReturn}% p.a.` : "—", icon: TrendingUp, color: "text-emerald-600" },
              { label: "Active Deals", value: stats?.activeDeals ?? 0, icon: BarChart2, color: "text-amber-600" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border bg-card p-3 flex flex-col items-center gap-1">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <span className="text-lg font-bold">{s.value}</span>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search investments…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
            {SECTORS.map((s) => (
              <button
                key={s}
                onClick={() => setSector(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${sector === s ? "bg-primary text-primary-foreground" : "border hover:bg-muted"}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {investments.map((inv) => {
              const pct = Math.min(100, Math.round((inv.raisedAmount / inv.targetAmount) * 100));
              const rc = RISK_CONFIG[inv.risk] ?? RISK_CONFIG.medium;
              const dl = daysLeft(inv.closingDate);
              return (
                <div
                  key={inv.id}
                  onClick={() => { setSelected(inv); setView("detail"); setCommitSuccess(false); }}
                  className="rounded-2xl border bg-card p-5 hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary">
                      {inv.company[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h3 className="font-semibold">{inv.title}</h3>
                        {inv.verified && <Shield className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{inv.company} · {inv.sector}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{inv.description}</p>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{fmt(inv.raisedAmount)} raised</span>
                      <span>{pct}% of {fmt(inv.targetAmount)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${rc.color}`}>{rc.label}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-muted">
                      <TrendingUp className="h-3 w-3 inline mr-1" />{inv.projectedReturn}% return
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-muted">
                      <Users className="h-3 w-3 inline mr-1" />{inv.investorCount} investors
                    </span>
                    {dl !== null && (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-muted ml-auto">
                        <Clock className="h-3 w-3 inline mr-1" />{dl > 0 ? `${dl}d left` : "Closed"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {investments.length === 0 && (
              <div className="text-center py-16">
                <TrendingUp className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-40" />
                <p className="font-semibold">No investments found</p>
                <p className="text-sm text-muted-foreground mt-1">Try a different search or sector.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
