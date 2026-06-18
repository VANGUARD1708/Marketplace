const PROFILE_TABS = [
  "Overview", "Posts", "Products", "Services", "Jobs",
  "Courses", "Portfolio", "Reviews", "Certificates", "Followers", "Following",
];

export default function ProfilePage() {
  return (
    <div>
      <div className="h-40 bg-muted relative">
        <div className="absolute -bottom-10 left-8">
          <div className="h-20 w-20 rounded-full bg-secondary border-4 border-background" />
        </div>
      </div>
      <div className="pt-14 px-8 pb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Display Name</h1>
            <p className="text-muted-foreground text-sm">@username</p>
          </div>
          <div className="flex gap-3 text-sm text-muted-foreground">
            <span>Trust Score: <strong>—</strong></span>
            <span>Followers: <strong>—</strong></span>
            <span>Following: <strong>—</strong></span>
          </div>
        </div>
        <div className="flex gap-2 mb-6 border-b">
          {PROFILE_TABS.map((tab) => (
            <button key={tab} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-primary transition-colors">
              {tab}
            </button>
          ))}
        </div>
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Profile content placeholder — not yet implemented.</p>
        </div>
      </div>
    </div>
  );
}
