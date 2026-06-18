export default function JobsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">
          Post a Job
        </button>
      </div>
      <div className="space-y-3 max-w-3xl">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-5 flex items-start justify-between">
            <div>
              <div className="h-4 w-48 bg-muted rounded mb-2" />
              <div className="h-3 w-32 bg-muted rounded mb-3" />
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span>Budget: $—</span>
                <span>Location: —</span>
                <span>Requirements: —</span>
              </div>
            </div>
            <button className="px-3 py-1 rounded-md border text-xs shrink-0">Apply</button>
          </div>
        ))}
      </div>
    </div>
  );
}
