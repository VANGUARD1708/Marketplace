import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shield, Clock, CheckCircle, AlertTriangle, Loader2, Lock, ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { apiFetch } from "@/lib/api";

type Escrow = {
  id: number; buyerId: number; sellerId: number; listingId?: number;
  amount: string; status: string; releasedAt?: string; createdAt: string;
};

const ME = 1;

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Shield }> = {
  pending:   { label: "Pending",   color: "bg-amber-100 text-amber-700",   icon: Clock },
  active:    { label: "Active",    color: "bg-blue-100 text-blue-700",     icon: Lock },
  funded:    { label: "Funded",    color: "bg-indigo-100 text-indigo-700", icon: Shield },
  released:  { label: "Released",  color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  refunded:  { label: "Refunded",  color: "bg-gray-100 text-gray-700",    icon: ArrowRight },
  disputed:  { label: "Disputed",  color: "bg-red-100 text-red-700",      icon: AlertTriangle },
};

const TABS = ["All", "Active", "Pending", "Released", "Disputed"] as const;

export default function EscrowPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<typeof TABS[number]>("All");

  const { data: escrows = [], isLoading } = useQuery({
    queryKey: ["escrows", ME],
    queryFn: () => apiFetch<Escrow[]>(`/escrow?userId=${ME}`),
  });

  const release = useMutation({
    mutationFn: (id: number) => apiFetch(`/escrow/${id}/release`, { method: "POST", body: JSON.stringify({ buyerId: ME }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["escrows", ME] }),
  });

  const dispute = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      apiFetch(`/escrow/${id}/dispute`, { method: "POST", body: JSON.stringify({ initiatorId: ME, reason }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["escrows", ME] }),
  });

  const filtered = tab === "All"
    ? escrows
    : escrows.filter((e) => e.status.toLowerCase() === tab.toLowerCase());

  const stats = {
    active: escrows.filter((e) => ["active", "funded"].includes(e.status)).length,
    released: escrows.filter((e) => e.status === "released").length,
    disputed: escrows.filter((e) => e.status === "disputed").length,
    total: escrows.reduce((sum, e) => sum + Number(e.amount), 0),
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Escrow Center</h1>
        <p className="text-sm text-muted-foreground">Manage protected transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active", value: stats.active, icon: Lock, color: "text-blue-600" },
          { label: "Released", value: stats.released, icon: CheckCircle, color: "text-emerald-600" },
          { label: "Disputes", value: stats.disputed, icon: AlertTriangle, color: "text-red-600" },
          { label: "Total Protected", value: `₦${stats.total.toLocaleString()}`, icon: Shield, color: "text-primary" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border bg-card p-4">
            <Icon className={`h-5 w-5 mb-2 ${color}`} />
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Info banner */}
      <div className="rounded-xl border bg-primary/5 border-primary/20 p-4 mb-6 flex items-start gap-3">
        <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium">Vanguard Escrow Protection</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Funds are held securely until both parties confirm the transaction. Only release funds once you've received your item.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto mb-5 pb-1">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
              tab === t ? "bg-primary text-primary-foreground" : "border hover:bg-muted"
            }`}>
            {t}
            {t === "Active" && stats.active > 0 && (
              <span className="ml-1.5 bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">{stats.active}</span>
            )}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      )}

      {/* Escrow list */}
      <div className="space-y-4">
        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-12 border rounded-2xl bg-card">
            <Shield className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium">No {tab.toLowerCase()} escrows</p>
            <p className="text-sm text-muted-foreground mt-1">Escrow transactions will appear here.</p>
          </div>
        )}
        {filtered.map((e) => {
          const cfg = STATUS_CONFIG[e.status] ?? STATUS_CONFIG.pending;
          const StatusIcon = cfg.icon;
          const isBuyer = e.buyerId === ME;
          const canRelease = isBuyer && ["active", "funded"].includes(e.status);
          const canDispute = ["active", "funded"].includes(e.status);

          return (
            <div key={e.id} className="rounded-2xl border bg-card p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4 text-primary" />
                    <p className="font-semibold">Escrow #{e.id}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Created {new Date(e.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                  <StatusIcon className="h-3 w-3" /> {cfg.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Buyer</p>
                  <Link href={`/profile/${e.buyerId}`}>
                    <span className="font-medium hover:text-primary cursor-pointer">
                      {e.buyerId === ME ? "You" : `User #${e.buyerId}`}
                    </span>
                  </Link>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Seller</p>
                  <Link href={`/profile/${e.sellerId}`}>
                    <span className="font-medium hover:text-primary cursor-pointer">
                      {e.sellerId === ME ? "You" : `User #${e.sellerId}`}
                    </span>
                  </Link>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Amount</p>
                  <p className="font-bold text-primary">₦{Number(e.amount).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {canRelease && (
                  <button
                    onClick={() => release.mutate(e.id)}
                    disabled={release.isPending}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium disabled:opacity-50">
                    {release.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                    Release Funds
                  </button>
                )}
                {canDispute && (
                  <button
                    onClick={() => {
                      const reason = window.prompt("Reason for dispute:");
                      if (reason) dispute.mutate({ id: e.id, reason });
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-red-600 border-red-300 text-sm hover:bg-red-50 transition">
                    <AlertTriangle className="h-3.5 w-3.5" /> Open Dispute
                  </button>
                )}
                <Link href={`/chat`}>
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm hover:bg-muted transition">
                    <MessageCircle className="h-3.5 w-3.5" /> Chat
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
