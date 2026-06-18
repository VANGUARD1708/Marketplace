export default function ServicesPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Services</h1>
        <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">
          Create Service
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-5">
            <div className="h-4 w-3/4 bg-muted rounded mb-2" />
            <div className="h-3 w-1/2 bg-muted rounded mb-3" />
            <p className="text-xs text-muted-foreground mb-4">Service description placeholder.</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">From $—</span>
              <button className="px-3 py-1 rounded-md border text-xs">Hire</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
