import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Shield, Loader2, MessageSquare } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Conversation = { id: number; type: string; createdAt: string };
type Message = { id: number; conversationId: number; senderId: number; content: string; messageType: string; createdAt: string };

const ME = 1;

export default function ChatPage() {
  const qc = useQueryClient();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: convos = [], isLoading: loadingConvos } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => apiFetch<Conversation[]>(`/chat/conversations?userId=${ME}`),
  });

  const { data: messages = [], isLoading: loadingMsgs } = useQuery({
    queryKey: ["messages", activeId],
    queryFn: () => apiFetch<Message[]>(`/chat/conversations/${activeId}/messages`),
    enabled: activeId !== null,
    refetchInterval: 3000,
  });

  const sendMsg = useMutation({
    mutationFn: (content: string) =>
      apiFetch(`/chat/conversations/${activeId}/messages`, {
        method: "POST",
        body: JSON.stringify({ senderId: ME, content }),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["messages", activeId] }); setText(""); },
  });

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <div className="flex h-[calc(100vh-56px)] bg-background">
      <div className="hidden md:flex w-72 border-r bg-card flex-col shrink-0">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {loadingConvos && <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}
          {convos.length === 0 && !loadingConvos && (
            <p className="text-xs text-muted-foreground text-center py-6">No conversations yet</p>
          )}
          {convos.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`w-full p-3 rounded-lg flex items-center gap-3 transition text-left ${activeId === c.id ? "bg-accent" : "hover:bg-accent/50"}`}
            >
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">Conversation #{c.id}</p>
                <p className="text-xs text-muted-foreground truncate">Tap to open</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {activeId === null ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Select a conversation</p>
            </div>
          </div>
        ) : (
          <>
            <div className="border-b p-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Conversation #{activeId}</h2>
                <p className="text-xs text-green-500">Active</p>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm hover:bg-accent transition">
                <Shield className="h-4 w-4" /> Escrow
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingMsgs && <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.senderId === ME ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${m.senderId === ME ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    {m.content}
                    <p className={`text-[10px] mt-1 ${m.senderId === ME ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="border-t p-3">
              <div className="flex items-center gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && text.trim()) { e.preventDefault(); sendMsg.mutate(text); }}}
                  placeholder="Type a message…"
                  className="flex-1 rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={() => text.trim() && sendMsg.mutate(text)}
                  disabled={!text.trim() || sendMsg.isPending}
                  className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
