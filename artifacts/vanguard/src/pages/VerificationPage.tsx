export default function VerificationPage() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Verification</h1>
      <div className="space-y-4">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="font-semibold mb-4">Certificate Upload</h2>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-4">
            <p className="text-sm text-muted-foreground">Drop certificate file here or click to browse</p>
          </div>
          <input
            type="text"
            placeholder="Certificate Number"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm mb-4"
          />
          <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">
            Submit for Verification
          </button>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <h2 className="font-semibold mb-3">Verification Status</h2>
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full bg-muted" />
            <span className="text-sm text-muted-foreground">No pending verification requests — placeholder</span>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <h2 className="font-semibold mb-2">Professional Badge</h2>
          <p className="text-sm text-muted-foreground">
            Professional badge placeholder — earn verification to display your badge on your profile.
          </p>
        </div>
      </div>
    </div>
  );
}
