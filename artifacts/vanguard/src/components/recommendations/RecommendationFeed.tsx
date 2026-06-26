import { useMemo, useState } from "react";
import {
  Sparkles,
  RefreshCw,
  Filter,
} from "lucide-react";

import RecommendationCard, {
  Recommendation,
} from "./RecommendationCard";

interface RecommendationFeedProps {
  recommendations: Recommendation[];
  loading?: boolean;
  onOpenRecommendation?: (
    recommendation: Recommendation,
  ) => void;
}

type FilterType =
  | "all"
  | "jobs"
  | "marketplace"
  | "services"
  | "investments"
  | "courses";

export default function RecommendationFeed({
  recommendations,
  loading = false,
  onOpenRecommendation,
}: RecommendationFeedProps) {
  const [filter, setFilter] =
    useState<FilterType>("all");

  const filtered =
    useMemo(() => {
      if (filter === "all")
        return recommendations;

      return recommendations.filter(
        (item) => {
          switch (filter) {
            case "jobs":
              return (
                item.type === "job"
              );

            case "marketplace":
              return (
                item.type ===
                "marketplace"
              );

            case "services":
              return (
                item.type ===
                "service"
              );

            case "investments":
              return (
                item.type ===
                "investment"
              );

            case "courses":
              return (
                item.type ===
                "course"
              );

            default:
              return true;
          }
        },
      );
    }, [
      filter,
      recommendations,
    ]);

  return (
    <div className="space-y-6">

      <div className="rounded-2xl border bg-card p-5">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>

            <div className="flex items-center gap-2">

              <Sparkles className="h-5 w-5 text-primary" />

              <h2 className="text-2xl font-bold">
                AI Recommendations
              </h2>

            </div>

            <p className="text-muted-foreground mt-2">
              Personalized opportunities
              selected by Vanguard AI.
            </p>

          </div>

          <button className="rounded-xl border px-4 py-2 flex items-center gap-2">

            <RefreshCw className="h-4 w-4" />

            Refresh Feed

          </button>

        </div>

      </div>

      <div className="flex flex-wrap gap-2">

        {[
          {
            label: "All",
            value: "all",
          },
          {
            label: "Jobs",
            value: "jobs",
          },
          {
            label: "Marketplace",
            value: "marketplace",
          },
          {
            label: "Services",
            value: "services",
          },
          {
            label: "Investments",
            value: "investments",
          },
          {
            label: "Courses",
            value: "courses",
          },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() =>
              setFilter(
                item.value as FilterType,
              )
            }
            className={`rounded-full px-4 py-2 text-sm transition ${
              filter ===
              item.value
                ? "bg-primary text-primary-foreground"
                : "border"
            }`}
          >
            <Filter className="inline h-3.5 w-3.5 mr-2" />

            {item.label}

          </button>
        ))}

      </div>

      {loading ? (

        <div className="rounded-2xl border bg-card p-12 text-center">

          <RefreshCw className="mx-auto h-10 w-10 animate-spin text-primary mb-4" />

          <h3 className="font-semibold">
            Vanguard AI is preparing your recommendations...
          </h3>

        </div>

      ) : filtered.length === 0 ? (

        <div className="rounded-2xl border bg-card p-12 text-center">

          <Sparkles className="mx-auto h-10 w-10 text-muted-foreground mb-4" />

          <h3 className="text-xl font-semibold">
            No Recommendations Found
          </h3>

          <p className="text-muted-foreground mt-2">
            Vanguard AI couldn't find
            matching opportunities yet.
          </p>

        </div>

      ) : (

        <div className="grid xl:grid-cols-2 gap-6">

          {filtered.map(
            (
              recommendation,
            ) => (
              <RecommendationCard
                key={
                  recommendation.id
                }
                recommendation={
                  recommendation
                }
                onOpen={
                  onOpenRecommendation
                }
              />
            ),
          )}

        </div>

      )}

      <div className="rounded-2xl border bg-primary/5 border-primary/20 p-6">

        <h3 className="font-bold text-lg mb-2">
          Why these recommendations?
        </h3>

        <p className="text-muted-foreground">
          Vanguard AI continuously
          analyzes your interests,
          searches, trust score,
          completed transactions,
          skills, location, and
          marketplace activity to
          deliver better opportunities
          every day.
        </p>

      </div>

    </div>
  );
}