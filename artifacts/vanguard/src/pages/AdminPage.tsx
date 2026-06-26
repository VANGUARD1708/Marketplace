import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users, ShoppingBag, Shield, AlertTriangle, CheckCircle, BarChart3,
  Loader2, Clock, XCircle, UserCheck, Layers,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type AdminStats = { users: number; listings: number; escrows: number; disputes: number; verifications: number; reports: number };
type VerificationRequest = { id: number; userId: number; type: string; status: string; createdAt: string };
type DisputeItem = { id: number; buyerId: number; sellerId: number; reason?: string; status: string; createdAt: string };
type GuardianAlert = { id: number; entityType: string; entityId: number; alertType: string; riskLevel: string; isResolved: boolean; createdAt: string };

const TABS = ["Overview", "Verifications", "Disputes", "Guardian"] as const;
type Tab = (typeof TABS)[number];

import { useState } from "react";

export default function AdminPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("Overview");

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => apiFetch<AdminStats>("/admin/stats"),
  });

  const { data: verifications = [], isLoading: loadingVerif } = useQuery({
    queryKey: ["admin-verifications"],
    queryFn: () => apiFetch<VerificationRequest[]>("/verification?status=pending"),
    enabled: tab === "Verifications",
  });

  const { data: disputes = [], isLoading: loadingDisputes } = useQuery({
    queryKey: ["admin-disputes"],
    queryFn: () => apiFetch<DisputeItem[]>("/disputes?status=open"),
    enabled: tab === "Disputes",
  });

  const { data: alerts = [], isLoading: loadingAlerts } = useQuery({
    queryKey: ["admin-guardian"],
    queryFn: () => apiFetch<GuardianAlert[]>("/admin/guardian-alerts"),
    enabled: tab === "Guardian",
  });

  const approveVerif = useMutation({
    mutationFn: (id: number) => apiFetch(`/verification/${id}/approve`, { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-verifications"] }),
  });

  const rejectVerif = useMutation({
    mutationFn: (id: number) => apiFetch(`/verification/${id}/reject`, { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-verifications"] }),
  });

  const STAT_CARDS = [
    { label: "Total Users", value: stats?.users, icon: Users },
    { label: "Listings", value: stats?.listings, icon: ShoppingBag },
    { label: "Active Escrows", value: stats?.escrows, icon: Layers },
    { label: "Open Disputes", value: stats?.disputes, icon: AlertTriangle },
    { label: "Pending Verif.", value: stats?.verifications, icon: CheckCircle },
    { label: "Admin Reports", value: stats?.reports, icon: BarChart3 },
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform management and moderation</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {STAT_CARDS.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            {loadingStats
              ? <div className="h-8 w-16 bg-muted rounded animate-pulse" />
              : <p className="text-3xl font-bold">{value?.toLocaleString() ?? "—"}</p>}
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

      {tab === "Overview" && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Clock className="h-4 w-4" /> Recent Activity</h3>
            <div className="space-y-3 text-sm">
              {[
                "Verification approved for John Electronics",
                "Escrow dispute opened on Order #384",
                "Listing removed for policy violation",
                "New company verification submitted",
                "Guardian flagged suspicious account",
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-2 py-2 border-b last:border-0">
                  <span className="text-muted-foreground">•</span> {a}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Shield className="h-4 w-4" /> Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Manage Users", icon: Users },
                { label: "Manage Listings", icon: ShoppingBag },
                { label: "Escrow Cases", icon: Layers },
                { label: "Review Disputes", icon: AlertTriangle },
                { label: "Guardian AI", icon: Shield },
                { label: "Analytics", icon: BarChart3 },
              ].map(({ label, icon: Icon }) => (
                <button key={label} className="flex items-center gap-2 rounded-xl border p-3 text-sm font-medium hover:bg-accent transition text-left">
                  <Icon className="h-4 w-4 text-muted-foreground" /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "Verifications" && (
        <div>
          {loadingVerif && <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}
          {verifications.length === 0 && !loadingVerif && (
            <div className="text-center py-12">
              <CheckCircle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium">No pending verifications</p>
            </div>
          )}
          <div className="space-y-3">
            {verifications.map((v) => (
              <div key={v.id} className="rounded-xl border bg-card p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-sm">Verification #{v.id}</p>
                  <p className="text-xs text-muted-foreground">User #{v.userId} · {v.type} · {new Date(v.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveVerif.mutate(v.id)}
                    disabled={approveVerif.isPending}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium disabled:opacity-50">
                    <CheckCircle className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => rejectVerif.mutate(v.id)}
                    disabled={rejectVerif.isPending}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium disabled:opacity-50">
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Disputes" && (
        <div>
          {loadingDisputes && <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}
          {disputes.length === 0 && !loadingDisputes && (
            <div className="text-center py-12">
              <AlertTriangle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium">No open disputes</p>
            </div>
          )}
          <div className="space-y-3">
            {disputes.map((d) => (
              <div key={d.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">Dispute #{d.id}</p>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{d.status}</span>
                </div>
                <p className="text-xs text-muted-foreground">Buyer #{d.buyerId} vs Seller #{d.sellerId}</p>
                {d.reason && <p className="text-sm mt-1">{d.reason}</p>}
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs">Resolve</button>
                  <button className="px-3 py-1.5 rounded-lg border text-xs">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Guardian" && (
        <div>
          {loadingAlerts && <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}
          {alerts.length === 0 && !loadingAlerts && (
            <div className="text-center py-12">
              <Shield className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium">No guardian alerts</p>
              <p className="text-sm text-muted-foreground">The platform is secure.</p>
            </div>
          )}
          <div className="space-y-3">
            {alerts.map((a) => (
              <div key={a.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">{a.alertType}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    a.riskLevel === "critical" ? "bg-red-100 text-red-700"
                    : a.riskLevel === "high" ? "bg-orange-100 text-orange-700"
                    : a.riskLevel === "medium" ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700"
                  }`}>{a.riskLevel.toUpperCase()}</span>
                </div>
                <p className="text-xs text-muted-foreground">{a.entityType} #{a.entityId} · {new Date(a.createdAt).toLocaleDateString()}</p>
                {!a.isResolved && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => apiFetch(`/admin/guardian-alerts/${a.id}/resolve`, { method: "POST" }).then(() => qc.invalidateQueries({ queryKey: ["admin-guardian"] }))}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs">
                      Resolve
                    </button>
                    <button className="px-3 py-1.5 rounded-lg border text-xs">Investigate</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
