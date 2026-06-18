export default function JobPage() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Job Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold mb-2">Job Description</h2>
            <p className="text-sm text-muted-foreground">Job description placeholder — not yet implemented.</p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold mb-3">Requirements</h2>
            <p className="text-sm text-muted-foreground">Requirements placeholder.</p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold mb-3">Employer Dashboard</h2>
            <p className="text-sm text-muted-foreground">Application system placeholder — not yet implemented.</p>
          </div>
        </div>
        <div>
          <div className="rounded-lg border bg-card p-5 mb-4">
            <p className="text-sm font-medium mb-1">Budget</p>
            <p className="text-xl font-bold mb-1">$—</p>
            <p className="text-xs text-muted-foreground mb-4">Location: —</p>
            <button className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">
              Apply Now
            </button>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <p className="text-sm font-medium mb-1">Posted by</p>
            <p className="text-xs text-muted-foreground">Employer profile placeholder.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
