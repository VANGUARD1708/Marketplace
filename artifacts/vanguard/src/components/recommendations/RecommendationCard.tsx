import {
  ArrowRight,
  Building2,
  Briefcase,
  ShoppingBag,
  Wrench,
  Landmark,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";

import TrustBadge from "@/components/trust/TrustBadge";

export type RecommendationType =
  | "job"
  | "marketplace"
  | "service"
  | "investment"
  | "course";

export interface Recommendation {
  id: number;

  title: string;

  company: string;

  description: string;

  type: RecommendationType;

  value: string;

  location: string;

  verified: boolean;

  trustScore: number;

  aiScore: number;

  reason: string;

  postedAt: string;
}

interface RecommendationCardProps {
  recommendation: Recommendation;

  onOpen?: (
    recommendation: Recommendation,
  ) => void;
}

function getIcon(
  type: RecommendationType,
) {
  switch (type) {
    case "job":
      return Briefcase;

    case "marketplace":
      return ShoppingBag;

    case "service":
      return Wrench;

    case "investment":
      return Landmark;

    case "course":
      return GraduationCap;

    default:
      return Building2;
  }
}

export default function RecommendationCard({
  recommendation,
  onOpen,
}: RecommendationCardProps) {
  const Icon = getIcon(
    recommendation.type,
  );

  return (
    <div className="rounded-2xl border bg-card p-5 hover:shadow-lg transition-all">

      <div className="flex justify-between items-start">

        <div className="flex gap-3">

          <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">

            <Icon className="h-7 w-7 text-primary" />

          </div>

          <div>

            <h3 className="font-bold text-lg">
              {recommendation.title}
            </h3>

            <p className="text-sm text-muted-foreground">
              {recommendation.company}
            </p>

          </div>

        </div>

        <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary flex items-center gap-1">

          <Sparkles className="h-3.5 w-3.5" />

          {recommendation.aiScore}% Match

        </div>

      </div>

      <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
        {recommendation.description}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">

        {recommendation.verified && (
          <TrustBadge badge="verified_company" />
        )}

        <TrustBadge badge="guardian_protected" />

      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">

        <div className="rounded-xl bg-muted/40 p-3">

          <p className="text-xs text-muted-foreground">
            Trust Score
          </p>

          <div className="flex items-center gap-2 mt-1">

            <ShieldCheck className="h-4 w-4 text-primary" />

            <span className="font-bold">
              {recommendation.trustScore}
            </span>

          </div>

        </div>

        <div className="rounded-xl bg-muted/40 p-3">

          <p className="text-xs text-muted-foreground">
            Opportunity
          </p>

          <div className="flex items-center gap-2 mt-1">

            <TrendingUp className="h-4 w-4 text-green-500" />

            <span className="font-bold">
              {recommendation.value}
            </span>

          </div>

        </div>

      </div>

      <div className="mt-5 rounded-xl bg-primary/5 border border-primary/20 p-3">

        <p className="text-xs font-semibold text-primary mb-1">
          AI Recommendation
        </p>

        <p className="text-sm">
          {recommendation.reason}
        </p>

      </div>

      <div className="flex items-center justify-between mt-5 text-xs text-muted-foreground">

        <div className="flex items-center gap-1">

          <MapPin className="h-3.5 w-3.5" />

          {recommendation.location}

        </div>

        <div className="flex items-center gap-1">

          <Clock className="h-3.5 w-3.5" />

          {recommendation.postedAt}

        </div>

      </div>

      <button
        onClick={() =>
          onOpen?.(
            recommendation,
          )
        }
        className="w-full mt-6 rounded-xl bg-primary py-3 text-primary-foreground flex items-center justify-center gap-2"
      >
        View Recommendation

        <ArrowRight className="h-4 w-4" />
      </button>

    </div>
  );
}