import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowDownLeft, ArrowUpRight, Wallet, Shield, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

type WalletData = { id: number; userId: number; availableBalance: string; pendingBalance?: string; escrowBalance?: string };
type Transaction = { id: number; type: string; amount: string; status: string; createdAt: string };

const ME = 1;

export default function WalletPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<"deposit" | "withdraw" | null>(null);
  const [amount, setAmount] = useState("");

  const { data: wallet, isLoading: loadingWallet, error: walletError } = useQuery({
    queryKey: ["wallet"],
    queryFn: () => apiFetch<WalletData>(`/wallet?userId=${ME}`),
  });

  const { data: txns = [], isLoading: loadingTxns } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => apiFetch<Transaction[]>(`/wallet/transactions?userId=${ME}`),
  });

  const action = useMutation({
    mutationFn: ({ type, amount }: { type: string; amount: number }) =>
      apiFetch(`/wallet/${type}`, { method: "POST", body: JSON.stringify({ userId: ME, amount }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["wallet"] }); qc.invalidateQueries({ queryKey: ["transactions"] }); setModal(null); setAmount(""); },
  });

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Wallet</h1>
        <p className="text-muted-foreground">Manage your Vanguard funds</p>
      </div>

      {walletError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive mb-6">
          {walletError.message} — make sure you're logged in.
        </div>
      )}

      <div className="rounded-2xl bg-primary text-primary-foreground p-6 mb-6">
        {loadingWallet ? (
          <div className="flex items-center gap-2 py-2"><Loader2 className="h-5 w-5 animate-spin" /><span className="text-sm opacity-80">Loading…</span></div>
        ) : (
          <>
            <p className="text-sm opacity-80">Available Balance</p>
            <h2 className="text-4xl font-bold mt-1">₦{Number(wallet?.availableBalance ?? 0).toLocaleString()}</h2>
            <p className="text-sm opacity-70 mt-1">Vanguard Wallet</p>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button onClick={() => setModal("deposit")} className="rounded-xl bg-primary text-primary-foreground py-3 font-medium flex items-center justify-center gap-2">
          <ArrowDownLeft className="h-4 w-4" /> Deposit
        </button>
        <button onClick={() => setModal("withdraw")} className="rounded-xl border py-3 font-medium flex items-center justify-center gap-2">
          <ArrowUpRight className="h-4 w-4" /> Withdraw
        </button>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card border rounded-2xl p-6 w-80 shadow-xl">
            <h3 className="font-semibold text-lg mb-4 capitalize">{modal}</h3>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full rounded-xl border bg-background px-3 py-2 text-sm mb-4 outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex gap-2">
              <button onClick={() => setModal(null)} className="flex-1 rounded-xl border py-2 text-sm">Cancel</button>
              <button
                disabled={!amount || action.isPending}
                onClick={() => action.mutate({ type: modal, amount: Number(amount) })}
                className="flex-1 rounded-xl bg-primary text-primary-foreground py-2 text-sm disabled:opacity-50"
              >
                {action.isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border bg-card p-4 flex items-start gap-3">
          <Wallet className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-sm">Wallet Status</p>
            <p className="text-xs text-muted-foreground mt-1">Active and ready for deposits, transfers and purchases.</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-sm">Escrow Protection</p>
            <p className="text-xs text-muted-foreground mt-1">Funds held in escrow are protected until both parties confirm.</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Recent Transactions</h2>
          {loadingTxns && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        <div className="divide-y">
          {txns.length === 0 && !loadingTxns && (
            <p className="text-sm text-muted-foreground text-center py-8">No transactions yet.</p>
          )}
          {txns.map((t) => (
            <div key={t.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {t.type === "deposit" || t.type === "escrow_release"
                  ? <ArrowDownLeft className="h-5 w-5 text-green-500" />
                  : <ArrowUpRight className="h-5 w-5 text-red-500" />}
                <div>
                  <p className="text-sm font-medium capitalize">{t.type.replace("_", " ")}</p>
                  <p className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`font-semibold text-sm ${t.type === "deposit" || t.type === "escrow_release" ? "text-green-600" : "text-red-600"}`}>
                {t.type === "deposit" || t.type === "escrow_release" ? "+" : "-"}₦{Number(t.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
