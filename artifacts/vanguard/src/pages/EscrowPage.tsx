export default function EscrowPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Escrow</h1>
      <div className="flex gap-2 mb-6">
        {["Active Escrows", "Released Escrows", "Disputed Escrows"].map((tab) => (
          <button key={tab} className="px-4 py-2 rounded-md border text-sm font-medium first:bg-primary first:text-primary-foreground first:border-primary">
            {tab}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="h-4 w-40 bg-muted rounded mb-1" />
                <div className="h-3 w-24 bg-muted rounded" />
              </div>
              <span className="px-2 py-1 rounded-full bg-muted text-xs text-muted-foreground">Active</span>
            </div>
            <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground">
              <span>Buyer: —</span>
              <span>Seller: —</span>
              <span>Amount: $—</span>
              <span>Status: —</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
