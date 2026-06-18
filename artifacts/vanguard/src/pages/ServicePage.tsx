export default function ServicePage() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Service Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="rounded-lg border bg-card p-5 mb-4">
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-sm text-muted-foreground">Service description placeholder — not yet implemented.</p>
          </div>
          <div className="rounded-lg border bg-card p-5 mb-4">
            <h2 className="font-semibold mb-2">Portfolio</h2>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded" />
              ))}
            </div>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold mb-2">Reviews</h2>
            <p className="text-sm text-muted-foreground">Reviews placeholder — not yet implemented.</p>
          </div>
        </div>
        <div>
          <div className="rounded-lg border bg-card p-5 mb-4">
            <h2 className="font-semibold mb-2">Pricing</h2>
            <p className="text-sm text-muted-foreground mb-4">Pricing placeholder.</p>
            <button className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">
              Hire
            </button>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold mb-1">Teacher / Provider</h2>
            <p className="text-xs text-muted-foreground">Trust Score: — | Reviews: —</p>
          </div>
        </div>
      </div>
    </div>
  );
}
