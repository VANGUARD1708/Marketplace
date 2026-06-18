export default function CoursePage() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Course Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="h-52 bg-muted rounded-lg" />
          <div className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold mb-2">About this Course</h2>
            <p className="text-sm text-muted-foreground">Course description placeholder — not yet implemented.</p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold mb-3">Lessons</h2>
            <ul className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="h-4 w-4 rounded-full bg-muted" />
                  Lesson {i + 1} — placeholder
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold mb-2">Student Reviews</h2>
            <p className="text-sm text-muted-foreground">Reviews placeholder — not yet implemented.</p>
          </div>
        </div>
        <div>
          <div className="rounded-lg border bg-card p-5 mb-4">
            <p className="text-xl font-bold mb-1">$—</p>
            <p className="text-xs text-muted-foreground mb-4">— lessons · — materials</p>
            <button className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">
              Enroll Now
            </button>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <p className="text-sm font-medium mb-1">Teacher</p>
            <p className="text-xs text-muted-foreground">Teacher profile placeholder.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
