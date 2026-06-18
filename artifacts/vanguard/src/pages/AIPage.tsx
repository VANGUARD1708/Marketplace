export default function AIPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Vanguard AI</h1>
      <p className="text-muted-foreground mb-8">AI-powered tools for recommendations, search, and trust monitoring.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="font-semibold mb-2">AI Assistant</h2>
          <p className="text-sm text-muted-foreground mb-4">Ask anything about the platform, products, or services.</p>
          <div className="h-40 bg-muted rounded-lg mb-4 flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Chat interface placeholder</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask the AI..."
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
            />
            <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">
              Send
            </button>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h2 className="font-semibold mb-2">AI Recommendations</h2>
          <p className="text-sm text-muted-foreground mb-4">Personalized suggestions based on your activity.</p>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded" />
            ))}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h2 className="font-semibold mb-2">Guardian AI — Fraud Detection</h2>
          <p className="text-sm text-muted-foreground mb-3">Monitors activity for suspicious patterns.</p>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between py-1 border-b">
              <span>Trust Monitoring</span><span>Placeholder</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span>Risk Analysis</span><span>Placeholder</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Fraud Alerts</span><span>0</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h2 className="font-semibold mb-2">AI Search</h2>
          <p className="text-sm text-muted-foreground mb-4">Semantic search across the entire platform.</p>
          <input
            type="search"
            placeholder="Search with AI..."
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
