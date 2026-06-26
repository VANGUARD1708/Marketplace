import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Bot, Send, Loader2, Shield, TrendingUp, Search, Star, Sparkles, RefreshCw } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Message = { role: "user" | "assistant"; content: string; ts: number };
type TrustResult = { score: number; level: string; badges: string[] };
type RiskResult = { riskScore: number; riskLevel: string; recommendation: string; reasons: string[] };

const QUICK_PROMPTS = [
  "How does Guardian AI protect me?",
  "What is escrow and how does it work?",
  "How can I improve my trust score?",
  "Is this seller trustworthy?",
  "What are the platform fees?",
];

export default function AIPage() {
  const [tab, setTab] = useState<"chat" | "guardian" | "trust">("chat");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm the Vanguard AI Assistant. I can help you with marketplace questions, trust scores, Guardian protection, and more. What would you like to know?", ts: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [guardianInput, setGuardianInput] = useState({ verified: false, companyVerified: false, completedEscrows: 0, disputes: 0, price: 0, transactionAmount: 0, positiveReviews: 0, accountAgeDays: 0 });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = useMutation({
    mutationFn: async (text: string) => {
      const userMsg: Message = { role: "user", content: text, ts: Date.now() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");

      const res = await apiFetch<{ reply: string }>("/ai/assistant", {
        method: "POST",
        body: JSON.stringify({ message: text, history: messages.slice(-6) }),
      }).catch(() => ({ reply: "Sorry, the AI service is currently unavailable. Please try again later." }));

      return res.reply;
    },
    onSuccess: (reply) => {
      setMessages((prev) => [...prev, { role: "assistant", content: reply, ts: Date.now() }]);
    },
  });

  const guardian = useMutation({
    mutationFn: () => apiFetch<{ trust: TrustResult; risk: RiskResult; guardianDecision: string; summary: string[] }>("/ai/analyze/guardian", {
      method: "POST", body: JSON.stringify(guardianInput),
    }),
  });

  const trustScore = useQuery({
    queryKey: ["trust-demo"],
    queryFn: () => apiFetch<TrustResult>("/ai/trust-score", {
      method: "POST",
      body: JSON.stringify({ verified: true, companyVerified: false, completedEscrows: 5, disputes: 0, positiveReviews: 12, accountAgeDays: 90 }),
    } as RequestInit),
    enabled: tab === "trust",
  });

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Vanguard AI</h1>
        </div>
        <p className="text-sm text-muted-foreground">AI-powered assistant, fraud detection, and trust analysis</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-6">
        {[
          { id: "chat", label: "AI Assistant", icon: Bot },
          { id: "guardian", label: "Guardian Analysis", icon: Shield },
          { id: "trust", label: "Trust Score", icon: Star },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id as typeof tab)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              tab === id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {/* AI Chat */}
      {tab === "chat" && (
        <div className="flex flex-col gap-4">
          {/* Quick prompts */}
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((p) => (
              <button key={p} onClick={() => { setInput(p); }}
                className="px-3 py-1.5 rounded-full border text-xs hover:bg-primary hover:text-primary-foreground hover:border-primary transition">
                {p}
              </button>
            ))}
          </div>

          {/* Chat window */}
          <div className="rounded-2xl border bg-card flex flex-col h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    {m.content}
                    <p className={`text-[10px] mt-1 ${m.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              {sendMessage.isPending && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted px-4 py-3 rounded-2xl flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Thinking…</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t p-3">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && input.trim()) { e.preventDefault(); sendMessage.mutate(input); } }}
                  placeholder="Ask anything about Vanguard…"
                  className="flex-1 rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={() => input.trim() && sendMessage.mutate(input)}
                  disabled={!input.trim() || sendMessage.isPending}
                  className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guardian Analysis */}
      {tab === "guardian" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Input Parameters</h3>
            <div className="space-y-3">
              {[
                { key: "verified", label: "ID Verified", type: "checkbox" },
                { key: "companyVerified", label: "Company Verified", type: "checkbox" },
                { key: "completedEscrows", label: "Completed Escrows", type: "number" },
                { key: "disputes", label: "Disputes", type: "number" },
                { key: "positiveReviews", label: "Positive Reviews", type: "number" },
                { key: "accountAgeDays", label: "Account Age (days)", type: "number" },
                { key: "price", label: "Listing Price (₦)", type: "number" },
                { key: "transactionAmount", label: "Transaction Amount (₦)", type: "number" },
              ].map(({ key, label, type }) => (
                <div key={key} className="flex items-center justify-between gap-3">
                  <label className="text-sm">{label}</label>
                  {type === "checkbox" ? (
                    <input type="checkbox"
                      checked={guardianInput[key as keyof typeof guardianInput] as boolean}
                      onChange={(e) => setGuardianInput((p) => ({ ...p, [key]: e.target.checked }))}
                      className="h-4 w-4 rounded" />
                  ) : (
                    <input type="number"
                      value={guardianInput[key as keyof typeof guardianInput] as number}
                      onChange={(e) => setGuardianInput((p) => ({ ...p, [key]: Number(e.target.value) }))}
                      className="w-24 rounded-lg border bg-background px-2 py-1 text-sm text-right" />
                  )}
                </div>
              ))}
              <button onClick={() => guardian.mutate()} disabled={guardian.isPending}
                className="w-full mt-2 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                {guardian.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</> : <><Shield className="h-4 w-4" /> Run Guardian Analysis</>}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Analysis Results</h3>
            {!guardian.data && !guardian.isPending && (
              <div className="text-center py-10 text-muted-foreground">
                <Shield className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Enter parameters and run the analysis</p>
              </div>
            )}
            {guardian.data && (
              <div className="space-y-4">
                <div className={`rounded-xl p-4 ${
                  guardian.data.guardianDecision === "block" ? "bg-red-50 border border-red-200"
                  : guardian.data.guardianDecision === "review" ? "bg-amber-50 border border-amber-200"
                  : "bg-emerald-50 border border-emerald-200"
                }`}>
                  <p className="font-semibold text-sm">Guardian Decision</p>
                  <p className={`text-2xl font-bold uppercase mt-1 ${
                    guardian.data.guardianDecision === "block" ? "text-red-600"
                    : guardian.data.guardianDecision === "review" ? "text-amber-600"
                    : "text-emerald-600"
                  }`}>{guardian.data.guardianDecision}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border p-3">
                    <p className="text-xs text-muted-foreground">Trust Score</p>
                    <p className="text-2xl font-bold">{guardian.data.trust.score}</p>
                    <p className="text-xs font-medium">{guardian.data.trust.level}</p>
                  </div>
                  <div className="rounded-xl border p-3">
                    <p className="text-xs text-muted-foreground">Risk Score</p>
                    <p className="text-2xl font-bold">{guardian.data.risk.riskScore}</p>
                    <p className="text-xs font-medium capitalize">{guardian.data.risk.riskLevel}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Summary</p>
                  {guardian.data.summary.map((s, i) => <p key={i} className="text-sm text-muted-foreground">• {s}</p>)}
                </div>
                {guardian.data.risk.reasons.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Risk Factors</p>
                    {guardian.data.risk.reasons.map((r, i) => <p key={i} className="text-sm text-red-600">⚠ {r}</p>)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trust Score */}
      {tab === "trust" && (
        <div className="max-w-md">
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" /> Trust Score Demo</h3>
              <button onClick={() => trustScore.refetch()} className="text-muted-foreground hover:text-foreground">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            {trustScore.isLoading && <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin" /></div>}
            {trustScore.data && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="absolute" width="128" height="128" viewBox="0 0 128 128">
                      <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      <circle cx="64" cy="64" r="56" fill="none"
                        stroke={trustScore.data.score >= 80 ? "#10b981" : trustScore.data.score >= 60 ? "#3b82f6" : "#f59e0b"}
                        strokeWidth="8" strokeDasharray={`${(trustScore.data.score / 100) * 351.9} 351.9`}
                        strokeLinecap="round" transform="rotate(-90 64 64)" />
                    </svg>
                    <div className="text-center z-10">
                      <p className="text-3xl font-bold">{trustScore.data.score}</p>
                      <p className="text-xs text-muted-foreground">/ 100</p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{trustScore.data.level}</p>
                  <p className="text-sm text-muted-foreground">Trust Level</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Badges Earned</p>
                  <div className="flex flex-wrap gap-2">
                    {trustScore.data.badges.map((b) => (
                      <span key={b} className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">✓ {b}</span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-muted p-4 text-sm">
                  <p className="font-medium mb-2">How to improve your score:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Complete identity verification (+20 pts)</li>
                    <li>• Complete more escrow transactions (+2 pts each)</li>
                    <li>• Collect positive reviews (+1 pt each)</li>
                    <li>• Verify your company (+15 pts)</li>
                    <li>• Avoid disputes (-8 pts each)</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
