export default function FeedPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Feed</h1>
      <p className="text-muted-foreground mb-6">Scroll through posts from your network.</p>
      <div className="space-y-4 max-w-2xl">
        {["Products", "Services", "Jobs", "Courses", "Business Updates"].map((type) => (
          <div key={type} className="rounded-lg border bg-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div>
                <div className="h-3 w-32 bg-muted rounded mb-1" />
                <div className="h-2 w-20 bg-muted rounded" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {type} feed post placeholder — not yet implemented.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground border-t pt-3">
              <span>Like</span>
              <span>Comment</span>
              <span>Share</span>
              <span>Save</span>
              <span>Follow</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
