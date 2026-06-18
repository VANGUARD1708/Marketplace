export default function MarketplacePage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">
          Create Listing
        </button>
      </div>
      <div className="flex gap-4 mb-6">
        <input
          type="search"
          placeholder="Search marketplace..."
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
        />
        <button className="px-4 py-2 rounded-md border text-sm">Filters</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card overflow-hidden">
            <div className="h-40 bg-muted" />
            <div className="p-4">
              <div className="h-4 w-3/4 bg-muted rounded mb-2" />
              <div className="h-3 w-1/2 bg-muted rounded mb-3" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">$—</span>
                <span className="text-xs text-muted-foreground">Trust: —</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
