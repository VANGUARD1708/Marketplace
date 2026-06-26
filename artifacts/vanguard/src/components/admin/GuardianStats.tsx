import {
  Shield,
  AlertTriangle,
  Activity,
  Lock,
} from "lucide-react";

interface GuardianStatsProps {
  alerts: number;
  fraudCases: number;
  riskAssessments: number;
  actions: number;
}

export default function GuardianStats({
  alerts,
  fraudCases,
  riskAssessments,
  actions,
}: GuardianStatsProps) {
  const stats = [
    {
      title: "Alerts",
      value: alerts,
      icon: AlertTriangle,
    },
    {
      title: "Fraud Cases",
      value: fraudCases,
      icon: Shield,
    },
    {
      title: "Risk Assessments",
      value: riskAssessments,
      icon: Activity,
    },
    {
      title: "Actions",
      value: actions,
      icon: Lock,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(
        (stat) => {
          const Icon =
            stat.icon;

          return (
            <div
              key={
                stat.title
              }
              className="rounded-xl border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {stat.title}
                </p>

                <Icon className="h-5 w-5 text-primary" />
              </div>

              <p className="mt-3 text-3xl font-bold">
                {stat.value}
              </p>
            </div>
          );
        },
      )}
    </div>
  );
}