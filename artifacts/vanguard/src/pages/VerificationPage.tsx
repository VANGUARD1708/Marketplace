import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ShieldCheck, FileText, Building2, User, Award, CheckCircle2,
  Clock, XCircle, Loader2, ChevronRight, Upload,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

const ME = 1;

type VerifRequest = {
  id: number; userId: number; type: string; status: string;
  notes?: string; createdAt: string;
};

type VerifType = {
  id: string; title: string; description: string;
  icon: typeof User; benefits: string[]; docs: string[];
};

const VERIF_TYPES: VerifType[] = [
  {
    id: "identity",
    title: "Identity Verification",
    icon: User,
    description: "Verify your government-issued ID to earn the Verified badge.",
    benefits: ["Verified badge on profile", "+20 trust score points", "Increased buyer confidence"],
    docs: ["Government-issued ID (NIN, Passport, Driver's License)", "Selfie photo"],
  },
  {
    id: "business",
    title: "Business Verification",
    icon: Building2,
    description: "Verify your business registration with CAC.",
    benefits: ["Verified Business badge", "+15 trust score points", "Better marketplace visibility"],
    docs: ["CAC Certificate of Incorporation", "Business registration number", "Company address proof"],
  },
  {
    id: "professional",
    title: "Professional Certificate",
    icon: Award,
    description: "Verify your professional qualifications and credentials.",
    benefits: ["Professional badge", "Expert status on platform", "Higher service rates"],
    docs: ["Professional certificate", "Issuing authority contact", "Certificate number"],
  },
];

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
    pending:  { label: "Pending Review", color: "bg-amber-100 text-amber-700", icon: Clock },
    approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
  };
  const c = cfg[status] ?? cfg.pending;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}>
      <Icon className="h-3 w-3" /> {c.label}
    </span>
  );
}

export default function VerificationPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<VerifType | null>(null);
  const [certNumber, setCertNumber] = useState("");

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["verif-requests", ME],
    queryFn: () => apiFetch<VerifRequest[]>(`/verification?userId=${ME}`),
  });

  const submit = useMutation({
    mutationFn: (data: { type: string; certNumber?: string }) =>
      apiFetch("/verification", { method: "POST", body: JSON.stringify({ userId: ME, ...data }) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["verif-requests", ME] });
      setSelected(null);
      setCertNumber("");
    },
  });

  const pending = requests.filter((r) => r.status === "pending");
  const approved = requests.filter((r) => r.status === "approved");

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Verification Center</h1>
        <p className="text-sm text-muted-foreground">Increase trust and unlock verified badges</p>
      </div>

      {/* Current status */}
      {approved.length > 0 && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 mb-6 flex items-start gap-4">
          <ShieldCheck className="h-8 w-8 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-800">You're Verified!</p>
            <p className="text-sm text-emerald-700 mt-0.5">
              {approved.map((r) => r.type).join(", ")} verification{approved.length > 1 ? "s" : ""} approved.
            </p>
          </div>
        </div>
      )}

      {/* Active requests */}
      {isLoading && <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}
      {requests.length > 0 && (
        <div className="rounded-2xl border bg-card p-5 mb-6">
          <h3 className="font-semibold mb-3">Your Requests</h3>
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium capitalize">{r.type} Verification</p>
                  <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</p>
                  {r.notes && <p className="text-xs text-red-600 mt-0.5">{r.notes}</p>}
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Select verification type */}
      {!selected && (
        <div>
          <h3 className="font-semibold mb-3">Apply for Verification</h3>
          <div className="space-y-3">
            {VERIF_TYPES.map((v) => {
              const Icon = v.icon;
              const alreadyApplied = requests.some((r) => r.type === v.id && r.status !== "rejected");
              return (
                <button key={v.id} onClick={() => !alreadyApplied && setSelected(v)} disabled={alreadyApplied}
                  className="w-full rounded-2xl border bg-card p-5 flex items-center gap-4 hover:shadow-md transition text-left disabled:opacity-50 disabled:cursor-not-allowed">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{v.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{v.description}</p>
                  </div>
                  {alreadyApplied
                    ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    : <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  }
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Submit form */}
      {selected && (
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => setSelected(null)} className="text-sm text-muted-foreground hover:text-foreground">← Back</button>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <selected.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{selected.title}</p>
              <p className="text-sm text-muted-foreground">{selected.description}</p>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-sm font-medium mb-2">Benefits</p>
            <ul className="space-y-1">
              {selected.benefits.map((b) => (
                <li key={b} className="text-sm text-emerald-600 flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-5">
            <p className="text-sm font-medium mb-3">Required Documents</p>
            <div className="space-y-2">
              {selected.docs.map((d) => (
                <div key={d} className="border-2 border-dashed rounded-xl p-4 flex items-center gap-3 text-sm text-muted-foreground hover:border-primary/40 transition cursor-pointer">
                  <Upload className="h-4 w-4 shrink-0" />
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>

          {selected.id === "professional" && (
            <div className="mb-5">
              <label className="text-sm font-medium block mb-1.5">Certificate Number</label>
              <input value={certNumber} onChange={(e) => setCertNumber(e.target.value)}
                placeholder="e.g. COREN/2024/001234"
                className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={() => setSelected(null)} className="flex-1 rounded-xl border py-2.5 text-sm font-medium">
              Cancel
            </button>
            <button
              onClick={() => submit.mutate({ type: selected.id, certNumber })}
              disabled={submit.isPending}
              className="flex-1 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
              {submit.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : <><FileText className="h-4 w-4" /> Submit Request</>}
            </button>
          </div>
          {submit.error && <p className="text-xs text-destructive mt-2">{(submit.error as Error).message}</p>}
          {submit.isSuccess && <p className="text-xs text-emerald-600 mt-2">✓ Submitted! We'll review within 24-48 hours.</p>}
        </div>
      )}
    </div>
  );
}
