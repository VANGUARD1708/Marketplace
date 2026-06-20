import {
  Building2,
  ShieldCheck,
  Users,
  Package,
  Briefcase,
  Star,
} from "lucide-react";

export default function CompanyPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">
          Company Hub
        </h1>

        <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground">
          Create Company
        </button>
      </div>

      <div className="h-52 bg-muted rounded-xl mb-6 relative">
        <div className="absolute -bottom-10 left-6">
          <div className="h-20 w-20 rounded-xl bg-secondary border-4 border-background flex items-center justify-center">
            <Building2 className="h-8 w-8" />
          </div>
        </div>
      </div>

      <div className="pt-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">
                Vanguard Technologies
              </h2>

              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>

            <p className="text-muted-foreground">
              Trusted Marketplace Company
            </p>
          </div>

          <button className="px-4 py-2 rounded-md border">
            Follow Company
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">
              Employees
            </p>
            <p className="text-2xl font-bold">
              42
            </p>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">
              Followers
            </p>
            <p className="text-2xl font-bold">
              3.4K
            </p>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">
              Products
            </p>
            <p className="text-2xl font-bold">
              120
            </p>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">
              Services
            </p>
            <p className="text-2xl font-bold">
              18
            </p>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">
              Trust Score
            </p>
            <p className="text-2xl font-bold">
              98
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border bg-card p-5">
            <Package className="h-5 w-5 mb-3" />

            <h3 className="font-semibold mb-2">
              Products
            </h3>

            <p className="text-sm text-muted-foreground">
              Browse products sold by this company.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <Briefcase className="h-5 w-5 mb-3" />

            <h3 className="font-semibold mb-2">
              Services
            </h3>

            <p className="text-sm text-muted-foreground">
              Professional services offered.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <Star className="h-5 w-5 mb-3" />

            <h3 className="font-semibold mb-2">
              Reviews
            </h3>

            <p className="text-sm text-muted-foreground">
              Customer ratings and reviews.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-4">
              Company Description
            </h3>

            <p className="text-sm text-muted-foreground">
              This company specializes in
              products, services and trusted
              marketplace transactions through
              Vanguard.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5" />

              <h3 className="font-semibold">
                Employees
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <span>John Doe</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <span>Sarah Johnson</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <span>Michael Smith</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}