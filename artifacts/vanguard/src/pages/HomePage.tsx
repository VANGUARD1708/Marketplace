import { Flame, ShieldCheck, Briefcase, Wallet, ShoppingBag, Users } from "lucide-react";
import { Link } from "wouter";

export default function HomePage() {
  const stats = [
    {
      title: "Trending Deals",
      value: "124",
      icon: Flame,
    },
    {
      title: "Protected Trades",
      value: "98%",
      icon: ShieldCheck,
    },
    {
      title: "Jobs Available",
      value: "43",
      icon: Briefcase,
    },
    {
      title: "Active Users",
      value: "2.4k",
      icon: Users,
    },
  ];

  const modules = [
    {
      title: "Marketplace",
      icon: ShoppingBag,
      href: "/marketplace",
      description:
        "Buy and sell with Vanguard protection.",
    },
    {
      title: "Feed",
      icon: Flame,
      href: "/feed",
      description:
        "Discover trending opportunities.",
    },
    {
      title: "Jobs",
      icon: Briefcase,
      href: "/jobs",
      description:
        "Find work and hire talent.",
    },
    {
      title: "Wallet",
      icon: Wallet,
      href: "/wallet",
      description:
        "Manage payments and escrow.",
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="rounded-3xl border bg-card p-8">
        <h1 className="text-4xl font-bold mb-3">
          Welcome to Vanguard
        </h1>

        <p className="text-muted-foreground text-lg">
          Discover trusted deals, verified sellers,
          jobs, services and opportunities.
        </p>

        <div className="flex gap-3 mt-6 flex-wrap">
          <Link href="/marketplace">
            <button className="px-5 py-3 rounded-xl bg-primary text-primary-foreground">
              Explore Marketplace
            </button>
          </Link>

          <Link href="/feed">
            <button className="px-5 py-3 rounded-xl border">
              Open Feed
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {item.title}
                </p>

                <Icon className="h-5 w-5 text-primary" />
              </div>

              <p className="text-3xl font-bold mt-3">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">
          Explore Vanguard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
              >
                <div className="rounded-2xl border bg-card p-5 hover:shadow-lg transition cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="h-6 w-6 text-primary" />

                    <h3 className="font-semibold">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <h2 className="font-bold text-xl mb-3">
          🔥 Trending Today
        </h2>

        <div className="space-y-3">
          <div className="border rounded-xl p-3">
            🛡 Verified Seller listed a new iPhone
          </div>

          <div className="border rounded-xl p-3">
            💼 12 new jobs posted today
          </div>

          <div className="border rounded-xl p-3">
            ⭐ Trust scores updated across the platform
          </div>
        </div>
      </div>
    </div>
  );
}