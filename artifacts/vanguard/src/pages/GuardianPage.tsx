import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Shield, AlertTriangle, CheckCircle, Eye, TrendingUp, Lock, Zap, Users, Activity, ChevronRight, ShieldAlert, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";

type GuardianAlert = {
  id: number;
  type: "fraud" | "suspicious" | "blocked" | "verified";
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  createdAt: string;
  resolved: boolean;
};

type GuardianStats = {
  protectedTransactions: number;
  fraudDetected: number;
  suspiciousBlocked: number;
  trustScore: number;
};

const MOCK_STATS: GuardianStats = {
  protectedTransactions: 3241,
  fraudDetected: 47,
  suspiciousBlocked: 128,
  trustScore: 82,
};

const MOCK_ALERTS: GuardianAlert[] = [
  { id: 1, type: "fraud", title: "Duplicate account detected", description: "A user attempted to create multiple accounts with the same phone number.", severity: "high", createdAt: new Date(Date.now() - 15 * 60000).toISOString(), resolved: false },
  { id: 2, type: "suspicious", title: "Unusual transaction pattern", description: "Multiple rapid transactions from a new account flagged for review.", severity: "medium", createdAt: new Date(Date.now() - 45 * 60000).toISOString(), resolved: false },
  { id: 3, type: "blocked", title: "Blacklisted seller attempt", description: "A previously banned seller tried to relist under a new identity.", severity: "high", createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(), resolved: true },
  { id: 4, type: "verified", title: "New business verified", description: "Adamu Traders Ltd successfully passed Guardian verification checks.", severity: "low", createdAt: new Date(Date.now() - 3 * 3600_000).toISOString(), resolved: true },
  { id: 5, type: "suspicious", title: "Price manipulation detected", description: "Listing price changed 12 times in 2 hours — possible artificial inflation.", severity: "medium", createdAt: new Date(Date.now() - 5 * 3600_000).toISOString(), resolved: true },
  { id: 6, type: "fraud", title: "Fake review network", description: "Cluster of 8 accounts posting identical 5-star reviews for same seller.", severity: "high", createdAt: new Date(Date.now() - 8 * 3600_000).toISOString(), resolved: true },
];

const RULES = [
  { name: "Identity Verification", description: "Cross-checks NIN, BVN, and photo ID against government databases.", active: true },
  { name: "Transaction Pattern Analysis", description: "Flags unusual transaction frequency, amounts, or geographic patterns.", active: true },
  { name: "Seller Trust Scoring", description: "Continuously updates seller trust based on transaction history and reviews.", active: true },
  { name: "Duplicate Account Detection", description: "Detects attempts to create multiple accounts using same credentials.", active: true },
  { name: "Price Manipulation Guard", description: "Monitors rapid price changes that suggest market manipulation.", active: true },
  { name: "Review Authenticity Check", description: "Identifies fake or coordinated review patterns.", active: true },
  { name: "Escrow Fraud Prevention", description: "Monitors escrow transactions for withdrawal fraud and collusion.", active: true },
  { name: "Blacklist Cross-Reference", description: "Checks all new accounts against Vanguard's fraud blacklist.", active: true },
];

const SEVERITY_CONFIG = {
  high: { color: "text-red-600 bg-red-50 border-red-200", dot: "bg-red-500" },
  medium: { color: "text-amber-600 bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  low: { color: "text-emerald-600 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
};

const TYPE_CONFIG = {
  fraud: { icon: ShieldAlert, color: "text-red-500" },
  suspicious: { icon: AlertTriangle, color: "text-amber-500" },
  blocked: { icon: Lock, color: "text-gray-500" },
  verified: { icon: ShieldCheck, color: "text-emerald-500" },
};

function timeAgo(date: string) {
  const m = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function GuardianPage() {
  const [tab, setTab] = useState<"overview" | "alerts" | "rules">("overview");
  const [alertFilter, setAlertFilter] = useState<"all" | "active" | "resolved">("all");

  const filteredAlerts = MOCK_ALERTS.filter((a) => {
    if (alertFilter === "active") return !a.resolved;
    if (alertFilter === "resolved") return a.resolved;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-2xl bg-primary/10"><Shield className="h-6 w-6 text-primary" /></div>
        <div>
          <h1 className="text-2xl font-bold">Guardian AI</h1>
          <p className="text-muted-foreground text-sm">Fraud detection & trust protection system</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-700">Active</span>
        </div>
      </div>

      <div className="flex gap-1 mb-6 bg-muted rounded-xl p-1">
        {(["overview", "alerts", "rules"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition ${tab === t ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Protected Trades", value: MOCK_STATS.protectedTransactions.toLocaleString(), icon: Shield, color: "text-primary", bg: "bg-primary/10" },
              { label: "Fraud Detected", value: MOCK_STATS.fraudDetected, icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50" },
              { label: "Threats Blocked", value: MOCK_STATS.suspiciousBlocked, icon: Lock, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Trust Score", value: `${MOCK_STATS.trustScore}/100`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border bg-card p-4">
                <div className={`h-9 w-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}><s.icon className={`h-5 w-5 ${s.color}`} /></div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Recent Guardian Activity</h2>
            <div className="space-y-3">
              {MOCK_ALERTS.slice(0, 4).map((alert) => {
                const tc = TYPE_CONFIG[alert.type];
                const TI = tc.icon;
                const sc = SEVERITY_CONFIG[alert.severity];
                return (
                  <div key={alert.id} className="flex items-start gap-3 p-3 rounded-xl border bg-muted/30">
                    <TI className={`h-4 w-4 mt-0.5 shrink-0 ${tc.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium">{alert.title}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full border ${sc.color}`}>{alert.severity}</span>
                        {alert.resolved && <span className="text-xs text-muted-foreground">Resolved</span>}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{alert.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{timeAgo(alert.createdAt)}</span>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setTab("alerts")} className="w-full mt-3 py-2.5 rounded-xl border text-sm font-medium hover:bg-muted transition flex items-center justify-center gap-1">
              View All Alerts <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Zap className="h-4 w-4 text-amber-500" /> How Guardian Protects You</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Eye, title: "24/7 Monitoring", desc: "Every transaction and listing is monitored in real time." },
                { icon: Shield, title: "Escrow Protection", desc: "Funds are held securely until delivery is confirmed." },
                { icon: Users, title: "Identity Checks", desc: "All sellers verified against government databases." },
                { icon: CheckCircle, title: "Review Integrity", desc: "AI detects and removes fake or manipulated reviews." },
              ].map((f) => (
                <div key={f.title} className="flex gap-3 p-3 rounded-xl bg-muted/30">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><f.icon className="h-4 w-4 text-primary" /></div>
                  <div><p className="text-sm font-medium">{f.title}</p><p className="text-xs text-muted-foreground">{f.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "alerts" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {(["all", "active", "resolved"] as const).map((f) => (
              <button key={f} onClick={() => setAlertFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition ${alertFilter === f ? "bg-primary text-primary-foreground" : "border hover:bg-muted"}`}>{f}</button>
            ))}
            <span className="ml-auto text-xs text-muted-foreground self-center">{filteredAlerts.length} alerts</span>
          </div>

          {filteredAlerts.map((alert) => {
            const tc = TYPE_CONFIG[alert.type];
            const TI = tc.icon;
            const sc = SEVERITY_CONFIG[alert.severity];
            return (
              <div key={alert.id} className={`rounded-2xl border bg-card p-4 ${alert.resolved ? "opacity-60" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl border ${sc.color}`}><TI className="h-4 w-4" /></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-sm">{alert.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${sc.color}`}>{alert.severity}</span>
                      {alert.resolved && <span className="text-xs bg-muted px-2 py-0.5 rounded-full">Resolved</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">{timeAgo(alert.createdAt)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "rules" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Guardian runs {RULES.length} active detection rules continuously.</p>
          {RULES.map((rule, i) => (
            <div key={i} className="rounded-2xl border bg-card p-4 flex items-start gap-3">
              <div className="mt-0.5 h-8 w-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-sm">{rule.name}</span>
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Active</span>
                </div>
                <p className="text-xs text-muted-foreground">{rule.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
