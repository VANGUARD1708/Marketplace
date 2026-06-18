export default function CompanyPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Company</h1>
        <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">
          Create Company
        </button>
      </div>
      <div className="h-40 bg-muted rounded-lg mb-6 relative">
        <div className="absolute -bottom-8 left-6">
          <div className="h-16 w-16 rounded-lg bg-secondary border-4 border-background" />
        </div>
      </div>
      <div className="pt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold mb-2">Company Name</h2>
            <p className="text-sm text-muted-foreground">Company profile placeholder — not yet implemented.</p>
            <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
              <span>Employees: —</span>
              <span>Followers: —</span>
              <span>Trust Score: —</span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold mb-2">Products</h2>
            <p className="text-sm text-muted-foreground">Products placeholder.</p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold mb-2">Services</h2>
            <p className="text-sm text-muted-foreground">Services placeholder.</p>
          </div>
        </div>
        <div>
          <div className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold mb-2">Employees</h2>
            <p className="text-sm text-muted-foreground">Employee list placeholder.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
