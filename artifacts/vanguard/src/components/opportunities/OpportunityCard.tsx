import {
  MapPin,
  ShieldCheck,
  TrendingUp,
  Clock,
  Briefcase,
  ShoppingBag,
  Wrench,
  GraduationCap,
  Landmark,
  Users,
  ArrowRight,
} from "lucide-react";

import TrustBadge from "@/components/trust/TrustBadge";
import ActivityBadge from "@/components/activity/ActivityBadge";

export type OpportunityType =
  | "job"
  | "marketplace"
  | "service"
  | "investment"
  | "course"
  | "partnership";

export interface Opportunity {
  id: number;
  title: string;
  description: string;

  type: OpportunityType;

  value: string;

  location: string;

  company: string;

  verified: boolean;

  trustScore: number;

  guardianRisk:
    | "Low"
    | "Medium"
    | "High";

  matchScore: number;

  views: number;

  saves: number;

  chats: number;

  postedAt: string;
}

interface Props {
  opportunity: Opportunity;
}

function getIcon(type: OpportunityType) {
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

    case "partnership":
      return Users;

    default:
      return Briefcase;
  }
}

export default function OpportunityCard({
  opportunity,
}: Props) {
  const Icon = getIcon(
    opportunity.type,
  );

  return (
    <div className="rounded-2xl border bg-card p-5 hover:shadow-lg transition-all">

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>

          <div>

            <h3 className="font-semibold text-lg">
              {opportunity.title}
            </h3>

            <p className="text-sm text-muted-foreground">
              {opportunity.company}
            </p>

          </div>

        </div>

        <ActivityBadge
          type="trending"
        />

      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {opportunity.description}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">

        {opportunity.verified && (
          <TrustBadge badge="verified_company" />
        )}

        <TrustBadge badge="guardian_protected" />

      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">

        <div className="rounded-xl bg-muted/40 p-3">

          <p className="text-xs text-muted-foreground">
            Match Score
          </p>

          <div className="flex items-center gap-2 mt-1">

            <TrendingUp className="h-4 w-4 text-green-500" />

            <span className="font-bold">
              {opportunity.matchScore}%
            </span>

          </div>

        </div>

        <div className="rounded-xl bg-muted/40 p-3">

          <p className="text-xs text-muted-foreground">
            Trust Score
          </p>

          <div className="flex items-center gap-2 mt-1">

            <ShieldCheck className="h-4 w-4 text-primary" />

            <span className="font-bold">
              {opportunity.trustScore}
            </span>

          </div>

        </div>

      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-5">

        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {opportunity.location}
        </span>

        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {opportunity.postedAt}
        </span>

      </div>

      <div className="flex gap-2 mt-5 flex-wrap">

        <ActivityBadge
          type="views"
          value={opportunity.views}
        />

        <ActivityBadge
          type="saves"
          value={opportunity.saves}
        />

        <ActivityBadge
          type="chats"
          value={opportunity.chats}
        />

      </div>

      <div className="mt-6">

        <button className="w-full rounded-xl bg-primary text-primary-foreground py-3 flex items-center justify-center gap-2 hover:opacity-90">

          View Opportunity

          <ArrowRight className="h-4 w-4" />

        </button>

      </div>

    </div>
  );
}