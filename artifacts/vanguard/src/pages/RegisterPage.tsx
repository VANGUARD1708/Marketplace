import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Loader2, Shield, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { authApi } from "@/api/auth";

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordOk = password.length >= 8;
  const passwordMatch = password === confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !username || !password || !passwordMatch) return;
    setError("");
    setIsLoading(true);
    try {
      const res = await authApi.register({ email, username, password });
      localStorage.setItem("vanguard_token", res.token);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Vanguard</span>
        </div>

        <div className="rounded-2xl border bg-card shadow-sm p-8">
          <h1 className="text-2xl font-bold mb-1">Create account</h1>
          <p className="text-sm text-muted-foreground mb-6">Join Nigeria's most trusted marketplace</p>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" required
                className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                  placeholder="your_username" required minLength={3} maxLength={32}
                  className="w-full rounded-xl border bg-background px-3 pl-7 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Letters, numbers and underscores only.</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" required
                  className="w-full rounded-xl border bg-background px-3 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && (
                <div className={`flex items-center gap-1 mt-1 text-xs ${passwordOk ? "text-emerald-600" : "text-muted-foreground"}`}>
                  <CheckCircle2 className="h-3 w-3" /> At least 8 characters
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Confirm password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter your password" required
                className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition" />
              {confirm && !passwordMatch && (
                <p className="text-xs text-destructive mt-1">Passwords do not match.</p>
              )}
            </div>

            <button type="submit" disabled={isLoading || !email || !username || !passwordOk || !passwordMatch}
              className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</> : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By creating an account, you agree to our{" "}
          <span className="underline cursor-pointer">Terms</span> and{" "}
          <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
