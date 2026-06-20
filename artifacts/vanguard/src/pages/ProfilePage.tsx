import {
  ShieldCheck,
  Star,
  Package,
  Briefcase,
  Award,
  Users,
} from "lucide-react";

const PROFILE_TABS = [
  "Overview",
  "Products",
  "Services",
  "Reviews",
  "Certificates",
  "Followers",
];

export default function ProfilePage() {
  return (
    <div>
      <div className="h-48 bg-muted relative">
        <div className="absolute -bottom-12 left-6">
          <div className="h-24 w-24 rounded-full bg-secondary border-4 border-background" />
        </div>
      </div>

      <div className="pt-16 px-4 md:px-8 pb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                Display Name
              </h1>

              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>

            <p className="text-muted-foreground">
              @username
            </p>

            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              Trusted seller on Vanguard.
              Electronics, gadgets and accessories.
            </p>
          </div>

          <button className="px-4 py-2 rounded-md border">
            Follow
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="rounded-xl border p-4 bg-card">
            <p className="text-xs text-muted-foreground">
              Trust Score
            </p>
            <p className="text-xl font-bold">
              95
            </p>
          </div>

          <div className="rounded-xl border p-4 bg-card">
            <p className="text-xs text-muted-foreground">
              Followers
            </p>
            <p className="text-xl font-bold">
              1,240
            </p>
          </div>

          <div className="rounded-xl border p-4 bg-card">
            <p className="text-xs text-muted-foreground">
              Following
            </p>
            <p className="text-xl font-bold">
              218
            </p>
          </div>

          <div className="rounded-xl border p-4 bg-card">
            <p className="text-xs text-muted-foreground">
              Products
            </p>
            <p className="text-xl font-bold">
              32
            </p>
          </div>

          <div className="rounded-xl border p-4 bg-card">
            <p className="text-xs text-muted-foreground">
              Reviews
            </p>
            <p className="text-xl font-bold">
              4.9★
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto border-b pb-2">
          {PROFILE_TABS.map((tab) => (
            <button
              key={tab}
              className="px-4 py-2 rounded-md border whitespace-nowrap"
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border p-5 bg-card">
            <Package className="h-5 w-5 mb-3" />
            <h3 className="font-semibold mb-2">
              Products Listed
            </h3>
            <p className="text-sm text-muted-foreground">
              32 active listings.
            </p>
          </div>

          <div className="rounded-xl border p-5 bg-card">
            <Briefcase className="h-5 w-5 mb-3" />
            <h3 className="font-semibold mb-2">
              Services
            </h3>
            <p className="text-sm text-muted-foreground">
              Professional services available.
            </p>
          </div>

          <div className="rounded-xl border p-5 bg-card">
            <Award className="h-5 w-5 mb-3" />
            <h3 className="font-semibold mb-2">
              Certificates
            </h3>
            <p className="text-sm text-muted-foreground">
              Verified credentials uploaded.
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5" />
            <h2 className="font-semibold">
              Recent Reviews
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="font-medium">
                Excellent seller
              </p>

              <p className="text-sm text-muted-foreground">
                Fast delivery and item matched description.
              </p>
            </div>

            <div>
              <p className="font-medium">
                Smooth transaction
              </p>

              <p className="text-sm text-muted-foreground">
                Escrow process worked perfectly.
              </p>
            </div>

            <div>
              <p className="font-medium">
                Trusted trader
              </p>

              <p className="text-sm text-muted-foreground">
                Would buy again.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}