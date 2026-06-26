import {
  Briefcase,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  Users,
  Landmark,
} from "lucide-react";

export interface OpportunityStatsData {
  activeOpportunities: number;
  verifiedBusinesses: number;
  totalOpportunityValue: string;
  successRate: number;
  guardianProtected: number;
  todayOpportunities: number;
}

interface OpportunityStatsProps {
  data: OpportunityStatsData;
}

export default function OpportunityStats({
  data,
}: OpportunityStatsProps) {
  const stats = [
    {
      title: "Active Opportunities",
      value: data.activeOpportunities.toLocaleString(),
      icon: Briefcase,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Verified Businesses",
      value: data.verifiedBusinesses.toLocaleString(),
      icon: Users,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Opportunity Value",
      value: data.totalOpportunityValue,
      icon: Landmark,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Guardian Protected",
      value: `${data.guardianProtected}%`,
      icon: ShieldCheck,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Today's Opportunities",
      value: data.todayOpportunities.toLocaleString(),
      icon: ShoppingBag,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "Success Rate",
      value: `${data.successRate}%`,
      icon: TrendingUp,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-2xl border bg-card p-5 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs text-muted-foreground">
                  {item.title}
                </p>

                <h2 className="text-2xl font-bold mt-2">
                  {item.value}
                </h2>

              </div>

              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center ${item.bg}`}
              >
                <Icon
                  className={`h-6 w-6 ${item.color}`}
                />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}