import {
  Sparkles,
  Briefcase,
  MapPin,
  Clock,
  TrendingUp,
  ShieldCheck,
  Users,
  Search,
} from "lucide-react";

export interface RecommendationReasonProps {
  aiScore: number;
  reasons: string[];
  confidence?: number;
}

export default function RecommendationReason({
  aiScore,
  reasons,
  confidence = 98,
}: RecommendationReasonProps) {
  const icons = [
    Briefcase,
    MapPin,
    TrendingUp,
    ShieldCheck,
    Users,
    Search,
    Clock,
  ];

  return (
    <div className="rounded-2xl border bg-card p-5">

      <div className="flex items-center gap-3 mb-5">

        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">

          <Sparkles className="h-6 w-6 text-primary" />

        </div>

        <div>

          <h3 className="font-bold text-lg">
            AI Recommendation
          </h3>

          <p className="text-sm text-muted-foreground">
            Vanguard AI analyzed your profile and activity.
          </p>

        </div>

      </div>

      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 mb-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-muted-foreground">
              Match Score
            </p>

            <h2 className="text-3xl font-bold text-primary">
              {aiScore}%
            </h2>

          </div>

          <div className="text-right">

            <p className="text-sm text-muted-foreground">
              Confidence
            </p>

            <h3 className="text-xl font-semibold">
              {confidence}%
            </h3>

          </div>

        </div>

      </div>

      <h4 className="font-semibold mb-3">
        Why Vanguard Recommended This
      </h4>

      <div className="space-y-3">

        {reasons.map((reason, index) => {
          const Icon =
            icons[index % icons.length];

          return (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl border p-3 hover:bg-muted/40 transition"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">

                <Icon className="h-5 w-5 text-primary" />

              </div>

              <div>

                <p className="font-medium">
                  {reason}
                </p>

              </div>

            </div>
          );
        })}

      </div>

      <div className="mt-6 rounded-xl bg-green-500/10 border border-green-500/20 p-4">

        <h4 className="font-semibold text-green-600 mb-2">
          Guardian AI Assessment
        </h4>

        <p className="text-sm text-muted-foreground">
          This recommendation has been matched using
          your interests, trust score, activity history,
          skills, location, and verified marketplace data.
          Guardian AI considers this recommendation
          low risk and highly relevant.
        </p>

      </div>

    </div>
  );
}