import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Briefcase,
  ShoppingBag,
  Landmark,
} from "lucide-react";

interface RecommendationBannerProps {
  userName?: string;
  recommendationCount?: number;
  trustScore?: number;
  onExplore?: () => void;
}

export default function RecommendationBanner({
  userName = "there",
  recommendationCount = 24,
  trustScore = 96,
  onExplore,
}: RecommendationBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-r from-primary/10 via-background to-primary/5 p-8">

      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

        <div className="max-w-3xl">

          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary font-medium mb-5">

            <Sparkles className="h-4 w-4" />

            Vanguard AI Recommendation Engine

          </div>

          <h1 className="text-4xl font-bold leading-tight">

            Welcome back,
            {" "}
            <span className="text-primary">
              {userName}
            </span>

          </h1>

          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">

            Vanguard AI has analyzed your interests,
            profile, trust score, skills and marketplace
            activity.

            We found
            {" "}
            <span className="font-bold text-primary">
              {recommendationCount}
            </span>
            {" "}
            high-quality opportunities
            that match you today.

          </p>

          <div className="mt-8 flex flex-wrap gap-3">

            <button
              onClick={onExplore}
              className="rounded-xl bg-primary text-primary-foreground px-6 py-3 font-medium flex items-center gap-2"
            >
              Explore Recommendations

              <ArrowRight className="h-4 w-4" />

            </button>

            <button className="rounded-xl border px-6 py-3 font-medium">

              Improve My Profile

            </button>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-4 min-w-[320px]">

          <div className="rounded-2xl border bg-card p-5">

            <TrendingUp className="h-7 w-7 text-green-500 mb-3" />

            <p className="text-sm text-muted-foreground">
              AI Match Quality
            </p>

            <h2 className="text-3xl font-bold">
              98%
            </h2>

          </div>

          <div className="rounded-2xl border bg-card p-5">

            <ShieldCheck className="h-7 w-7 text-primary mb-3" />

            <p className="text-sm text-muted-foreground">
              Trust Score
            </p>

            <h2 className="text-3xl font-bold">
              {trustScore}
            </h2>

          </div>

          <div className="rounded-2xl border bg-card p-5">

            <Briefcase className="h-7 w-7 text-blue-500 mb-3" />

            <p className="text-sm text-muted-foreground">
              Jobs
            </p>

            <h2 className="text-3xl font-bold">
              143
            </h2>

          </div>

          <div className="rounded-2xl border bg-card p-5">

            <ShoppingBag className="h-7 w-7 text-orange-500 mb-3" />

            <p className="text-sm text-muted-foreground">
              Marketplace
            </p>

            <h2 className="text-3xl font-bold">
              681
            </h2>

          </div>

        </div>

      </div>

      <div className="relative z-10 mt-8 rounded-2xl border bg-card p-5">

        <div className="flex items-center gap-3 mb-4">

          <Landmark className="h-6 w-6 text-primary" />

          <h3 className="text-xl font-bold">
            Why Vanguard Recommended These
          </h3>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">

          <div className="rounded-xl bg-muted/40 p-4">

            <h4 className="font-semibold mb-2">
              Based on Skills
            </h4>

            <p className="text-sm text-muted-foreground">
              Recommendations match your experience
              and profession.
            </p>

          </div>

          <div className="rounded-xl bg-muted/40 p-4">

            <h4 className="font-semibold mb-2">
              Based on Location
            </h4>

            <p className="text-sm text-muted-foreground">
              Nearby opportunities appear first.
            </p>

          </div>

          <div className="rounded-xl bg-muted/40 p-4">

            <h4 className="font-semibold mb-2">
              Based on Trust
            </h4>

            <p className="text-sm text-muted-foreground">
              Verified businesses receive higher
              priority.
            </p>

          </div>

          <div className="rounded-xl bg-muted/40 p-4">

            <h4 className="font-semibold mb-2">
              Guardian AI
            </h4>

            <p className="text-sm text-muted-foreground">
              Fraud detection helps filter risky
              opportunities before they reach you.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}