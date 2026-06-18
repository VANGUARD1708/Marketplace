const ADMIN_SECTIONS = [
  { label: "Users", count: "—" },
  { label: "Listings", count: "—" },
  { label: "Reports", count: "—" },
  { label: "Verification Requests", count: "—" },
  { label: "Escrow Cases", count: "—" },
  { label: "Disputes", count: "—" },
];

export default function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {ADMIN_SECTIONS.map((s) => (
          <div key={s.label} className="rounded-lg border bg-card p-5">
            <p className="text-sm text-muted-foreground mb-1">{s.label}</p>
            <p className="text-3xl font-bold">{s.count}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-card p-5">
          <h2 className="font-semibold mb-3">Recent Reports</h2>
          <p className="text-sm text-muted-foreground">Reports placeholder — not yet implemented.</p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <h2 className="font-semibold mb-3">Analytics</h2>
          <p className="text-sm text-muted-foreground">Analytics placeholder — not yet implemented.</p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <h2 className="font-semibold mb-3">Governance</h2>
          <p className="text-sm text-muted-foreground">Suggestion box, community feedback, sub-admin review — placeholder.</p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <h2 className="font-semibold mb-3">Decision Log</h2>
          <p className="text-sm text-muted-foreground">Decision log placeholder — not yet implemented.</p>
        </div>
      </div>
    </div>
  );
}
