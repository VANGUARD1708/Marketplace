export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Home</h1>
      <p className="text-muted-foreground mb-6">
        Welcome to Vanguard — the trusted marketplace and community platform.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Feed", "Marketplace", "Services", "Jobs", "Courses", "Wallet"].map((item) => (
          <div key={item} className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold mb-1">{item}</h2>
            <p className="text-sm text-muted-foreground">{item} module placeholder — not yet implemented.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
