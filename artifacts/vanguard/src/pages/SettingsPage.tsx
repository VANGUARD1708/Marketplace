import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Shield, Bell, CreditCard, Link2, Lock, BadgeCheck, Settings as SettingsIcon, ChevronRight, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

type UserData = { id: number; email: string; username: string; isActive: boolean; createdAt: string };

const SECTIONS = [
  { label: "Profile", desc: "Edit your public profile and bio.", icon: SettingsIcon },
  { label: "Privacy", desc: "Control profile visibility and activity.", icon: Lock },
  { label: "Notifications", desc: "Manage alerts and updates.", icon: Bell },
  { label: "Security", desc: "Passwords and two-factor authentication.", icon: Shield },
  { label: "Linked Accounts", desc: "Connect external services.", icon: Link2 },
  { label: "Payments", desc: "Wallets, cards and billing methods.", icon: CreditCard },
  { label: "Trust & Verification", desc: "Manage trust score and verification.", icon: BadgeCheck },
];

export default function SettingsPage() {
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const { data: user, isLoading, error } = useQuery<UserData>({
    queryKey: ["settings"],
    queryFn: () => apiFetch<UserData>("/settings"),
    retry: false,
  });

  useEffect(() => {
    if (user) { setEmail(user.email); setUsername(user.username); }
  }, [user]);

  const save = useMutation({
    mutationFn: () => apiFetch("/settings", { method: "PATCH", body: JSON.stringify({ email, username }) }),
    onSuccess: () => setEditing(false),
  });

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your Vanguard account.</p>
      </div>

      <div className="rounded-xl border bg-card p-5 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            {isLoading
              ? <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              : <h2 className="font-semibold">{user?.username ?? "—"}</h2>}
            <p className="text-sm text-muted-foreground">{user?.email ?? ""}</p>
          </div>
          {user != null && (
            <button onClick={() => setEditing(!editing)} className="text-sm text-primary hover:underline">
              {editing ? "Cancel" : "Edit"}
            </button>
          )}
        </div>

        {editing && user != null && (
          <div className="space-y-3 border-t pt-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"
                className="w-full mt-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <button disabled={save.isPending} onClick={() => save.mutate()}
              className="w-full rounded-lg bg-primary text-primary-foreground py-2 text-sm font-medium disabled:opacity-50">
              {save.isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Save Changes"}
            </button>
            {save.error != null && <p className="text-xs text-destructive">{(save.error as Error).message}</p>}
          </div>
        )}

        {error != null && (
          <p className="text-xs text-muted-foreground border-t pt-3">
            Sign in to manage account settings.
          </p>
        )}
      </div>

      <div className="space-y-2">
        {SECTIONS.map((s) => (
          <button key={s.label} className="w-full rounded-xl border bg-card p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors">
            <s.icon className="h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
