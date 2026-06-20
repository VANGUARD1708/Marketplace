import {
  Users,
  ShoppingBag,
  Shield,
  AlertTriangle,
  CheckCircle,
  BarChart3,
} from "lucide-react";

const stats = [
  {
    label: "Users",
    count: "12,543",
    icon: Users,
  },
  {
    label: "Listings",
    count: "4,201",
    icon: ShoppingBag,
  },
  {
    label: "Escrows",
    count: "184",
    icon: Shield,
  },
  {
    label: "Disputes",
    count: "7",
    icon: AlertTriangle,
  },
  {
    label: "Verifications",
    count: "43",
    icon: CheckCircle,
  },
  {
    label: "Reports",
    count: "18",
    icon: BarChart3,
  },
];

export default function AdminPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-muted-foreground">
          Platform management center.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border bg-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <item.icon className="h-5 w-5" />
            </div>

            <p className="text-sm text-muted-foreground">
              {item.label}
            </p>

            <p className="text-3xl font-bold">
              {item.count}
            </p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold mb-4">
            Recent Reports
          </h2>

          <div className="space-y-3">
            <div className="border rounded-lg p-3">
              Fake product report
            </div>

            <div className="border rounded-lg p-3">
              Suspicious transaction
            </div>

            <div className="border rounded-lg p-3">
              User misconduct report
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold mb-4">
            Verification Requests
          </h2>

          <div className="space-y-3">
            <div className="border rounded-lg p-3">
              John Electronics
            </div>

            <div className="border rounded-lg p-3">
              Sarah Ventures
            </div>

            <div className="border rounded-lg p-3">
              Digital Hub Ltd
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <button className="rounded-xl border p-5 text-left">
          Manage Users
        </button>

        <button className="rounded-xl border p-5 text-left">
          Manage Listings
        </button>

        <button className="rounded-xl border p-5 text-left">
          Manage Companies
        </button>

        <button className="rounded-xl border p-5 text-left">
          Escrow Cases
        </button>

        <button className="rounded-xl border p-5 text-left">
          Disputes
        </button>

        <button className="rounded-xl border p-5 text-left">
          Analytics
        </button>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="font-semibold mb-4">
          Admin Activity Log
        </h2>

        <div className="space-y-3 text-sm">
          <p>
            • Verification approved for
            John Electronics
          </p>

          <p>
            • Escrow dispute opened on
            Order #384
          </p>

          <p>
            • Listing removed for policy
            violation
          </p>

          <p>
            • New company verification
            submitted
          </p>
        </div>
      </div>
    </div>
  );
}