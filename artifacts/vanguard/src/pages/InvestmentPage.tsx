import { useState } from "react";
import { TrendingUp, DollarSign, Users, Clock, Shield, Star, ChevronRight, Search, Filter, BarChart2, Building2 } from "lucide-react";

type Investment = {
  id: number;
  title: string;
  company: string;
  sector: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  minInvestment: number;
  projectedReturn: number;
  duration: number;
  investorCount: number;
  risk: "low" | "medium" | "high";
  verified: boolean;
  closingDate: string;
};

const MOCK_INVESTMENTS: Investment[] = [
  { id: 1, title: "Lagos Agro-Processing Hub", company: "GreenNile Ltd", sector: "Agriculture", description: "Funding expansion of a cassava processing plant in Ogun State, targeting 500MT/month capacity.", targetAmount: 25_000_000, raisedAmount: 18_750_000, minInvestment: 500_000, projectedReturn: 22, duration: 18, investorCount: 34, risk: "medium", verified: true, closingDate: "2026-08-15" },
  { id: 2, title: "Fintech Bridge for SMEs", company: "PayBridge NG", sector: "FinTech", description: "A working capital lending platform for verified Vanguard marketplace sellers with escrow history.", targetAmount: 50_000_000, raisedAmount: 41_000_000, minInvestment: 1_000_000, projectedReturn: 28, duration: 12, investorCount: 67, risk: "medium", verified: true, closingDate: "2026-07-30" },
  { id: 3, title: "Solar Micro-Grid Project", company: "SunPower NG", sector: "Energy", description: "Installing solar micro-grids in 5 underserved communities in Kano and Kaduna states.", targetAmount: 80_000_000, raisedAmount: 24_000_000, minInvestment: 2_000_000, projectedReturn: 18, duration: 36, investorCount: 12, risk: "low", verified: true, closingDate: "2026-09-01" },
  { id: 4, title: "Abuja Commercial Real Estate", company: "Skyview Properties", sector: "Real Estate", description: "Construction of a mixed-use commercial complex in Maitama district, Abuja FCT.", targetAmount: 200_000_000, raisedAmount: 160_000_000, minInvestment: 5_000_000, projectedReturn: 35, duration: 24, investorCount: 28, risk: "low", verified: true, closingDate: "2026-07-15" },
  { id: 5, title: "EdTech Platform Scale-Up", company: "LearnNG", sector: "Education", description: "Expanding a vocational skills platform currently serving 12,000 students to 100,000.", targetAmount: 15_000_000, raisedAmount: 4_200_000, minInvestment: 250_000, projectedReturn: 32, duration: 20, investorCount: 19, risk: "high", verified: false, closingDate: "2026-08-31" },
  { id: 6, title: "Cold Chain Logistics Network", company: "CoolMove NG", sector: "Logistics", description: "Building Nigeria's first nationwide cold storage and transportation network for perishables.", targetAmount: 120_000_000, raisedAmount: 84_000_000, minInvestment: 3_000_000, projectedReturn: 25, duration: 30, investorCount: 45, risk: "medium", verified: true, closingDate: "2026-08-01" },
];

const SECTORS = ["All", "Agriculture", "FinTech", "Energy", "Real Estate", "Education", "Logistics"];
const RISK_CONFIG = {
  low: { label: "Low Risk", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  medium: { label: "Medium Risk", color: "text-amber-600 bg-amber-50 border-amber-200" },
  high: { label: "High Risk", color: "text-red-600 bg-red-50 border-red-200" },
};

function fmt(n: number) { return `₦${(n / 1_000_000).toFixed(1)}M`; }

export default function InvestmentPage() {
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const [selected, setSelected] = useState<Investment | null>(null);

  const filtered = MOCK_INVESTMENTS.filter((inv) => {
    const ms = inv.title.toLowerCase().includes(search.toLowerCase()) || inv.company.toLowerCase().includes(search.toLowerCase());
    const mcat = sector === "All" || inv.sector === sector;
    return ms && mcat;
  });

  const totalRaised = MOCK_INVESTMENTS.reduce((s, i) => s + i.raisedAmount, 0);
  const avgReturn = Math.round(MOCK_INVESTMENTS.reduce((s, i) => s + i.projectedReturn, 0) / MOCK_INVESTMENTS.length);

  if (selected) {
    const pct = Math.round((selected.raisedAmount / selected.targetAmount) * 100);
    const rc = RISK_CONFIG[selected.risk];
    const daysLeft = Math.ceil((new Date(selected.closingDate).getTime() - Date.now()) / 86400000);
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition">← Back to Opportunities</button>
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
              {selected.verified && <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full shrink-0"><Shield className="h-3 w-3" />Verified</span>}
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${rc.color} mb-4 inline-block`}>{rc.label}</span>
            <p className="text-sm text-muted-foreground mb-5">{selected.description}</p>

            <div className="mb-5">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium">₦{selected.raisedAmount.toLocaleString()} raised</span>
                <span className="text-muted-foreground">{pct}% of {fmt(selected.targetAmount)}</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} /></div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: "Projected Return", value: `${selected.projectedReturn}% p.a.` },
                { label: "Duration", value: `${selected.duration} months` },
                { label: "Min Investment", value: `₦${selected.minInvestment.toLocaleString()}` },
                { label: "Investors", value: selected.investorCount },
                { label: "Closing Date", value: new Date(selected.closingDate).toLocaleDateString() },
                { label: "Days Left", value: daysLeft > 0 ? `${daysLeft} days` : "Closed" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">{s.label}</p>
                  <p className="font-semibold text-sm">{s.value}</p>
                </div>
              ))}
            </div>

            <button className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition">
              Invest from ₦{selected.minInvestment.toLocaleString()}
            </button>
            <p className="text-xs text-center text-muted-foreground mt-3">All investments are escrow-protected via Vanguard</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Investment Opportunities</h1>
        <p className="text-muted-foreground text-sm">Verified investment opportunities with escrow-protected returns.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total Raised", value: `₦${(totalRaised / 1_000_000).toFixed(0)}M`, icon: DollarSign, color: "text-primary" },
          { label: "Avg Return", value: `${avgReturn}% p.a.`, icon: TrendingUp, color: "text-emerald-600" },
          { label: "Active Deals", value: MOCK_INVESTMENTS.length, icon: BarChart2, color: "text-amber-600" },
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
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search opportunities..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {SECTORS.map((s) => (
          <button key={s} onClick={() => setSector(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${sector === s ? "bg-primary text-primary-foreground" : "border hover:bg-muted"}`}>{s}</button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((inv) => {
          const pct = Math.round((inv.raisedAmount / inv.targetAmount) * 100);
          const rc = RISK_CONFIG[inv.risk];
          const daysLeft = Math.ceil((new Date(inv.closingDate).getTime() - Date.now()) / 86400000);
          return (
            <div key={inv.id} onClick={() => setSelected(inv)} className="rounded-2xl border bg-card p-5 hover:shadow-md transition cursor-pointer">
              <div className="flex items-start gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary">{inv.company[0]}</div>
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
                  <span>{fmt(inv.raisedAmount)} raised</span><span>{pct}% of {fmt(inv.targetAmount)}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${rc.color}`}>{rc.label}</span>
                <span className="text-xs px-2 py-0.5 rounded-full border bg-muted"><TrendingUp className="h-3 w-3 inline mr-1" />{inv.projectedReturn}% return</span>
                <span className="text-xs px-2 py-0.5 rounded-full border bg-muted"><Users className="h-3 w-3 inline mr-1" />{inv.investorCount} investors</span>
                <span className="text-xs px-2 py-0.5 rounded-full border bg-muted ml-auto"><Clock className="h-3 w-3 inline mr-1" />{daysLeft}d left</span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <TrendingUp className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-semibold">No opportunities found</p>
            <p className="text-sm text-muted-foreground mt-1">Try a different search or sector.</p>
          </div>
        )}
      </div>
    </div>
  );
}
