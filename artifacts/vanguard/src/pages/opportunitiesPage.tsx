import { useMemo, useState } from "react";

import OpportunityAssistant from "@/components/opportunities/OpportunityAssistant";
import OpportunityCard, {
  Opportunity,
} from "@/components/opportunities/OpportunityCard";
import OpportunityCategories, {
  OpportunityCategory,
} from "@/components/opportunities/OpportunityCategories";
import OpportunityFilters, {
  OpportunityFiltersValue,
} from "@/components/opportunities/OpportunityFilters";
import OpportunityStats from "@/components/opportunities/OpportunityStats";

const opportunities: Opportunity[] = [
  {
    id: 1,
    title: "Mechanical Engineer Needed",
    description:
      "A manufacturing company is hiring experienced mechanical engineers.",
    type: "job",
    value: "₦450,000 / month",
    location: "Lagos",
    company: "Prime Engineering Ltd",
    verified: true,
    trustScore: 96,
    guardianRisk: "Low",
    matchScore: 98,
    views: 1842,
    saves: 320,
    chats: 41,
    postedAt: "2 hours ago",
  },
  {
    id: 2,
    title: "Apple iPhone 15 Pro Max",
    description:
      "Verified seller offering escrow-protected delivery.",
    type: "marketplace",
    value: "₦1,650,000",
    location: "Abuja",
    company: "John Electronics",
    verified: true,
    trustScore: 94,
    guardianRisk: "Low",
    matchScore: 92,
    views: 2310,
    saves: 510,
    chats: 62,
    postedAt: "Today",
  },
  {
    id: 3,
    title: "Business Funding Opportunity",
    description:
      "Investors are looking for scalable Nigerian startups.",
    type: "investment",
    value: "₦5M - ₦50M",
    location: "Remote",
    company: "Vanguard Capital",
    verified: true,
    trustScore: 99,
    guardianRisk: "Low",
    matchScore: 95,
    views: 980,
    saves: 210,
    chats: 16,
    postedAt: "Yesterday",
  },
  {
    id: 4,
    title: "Medical Consultant",
    description:
      "Private hospital seeking licensed medical consultants.",
    type: "service",
    value: "Negotiable",
    location: "Port Harcourt",
    company: "CityCare Hospital",
    verified: true,
    trustScore: 91,
    guardianRisk: "Low",
    matchScore: 88,
    views: 640,
    saves: 82,
    chats: 19,
    postedAt: "5 hours ago",
  },
];

export default function OpportunitiesPage() {
  const [category, setCategory] =
    useState<OpportunityCategory>("All");

  const [filters, setFilters] =
    useState<OpportunityFiltersValue>({
      search: "",
      category: "All",
      location: "Anywhere",
      verifiedOnly: false,
      guardianOnly: false,
    });

  const filtered =
    useMemo(() => {
      return opportunities.filter(
        (item) => {
          const search =
            filters.search
              .toLowerCase()
              .trim();

          const matchSearch =
            !search ||
            item.title
              .toLowerCase()
              .includes(search) ||
            item.description
              .toLowerCase()
              .includes(search);

          const matchCategory =
            category === "All"
              ? true
              : item.type.toLowerCase() ===
                category.toLowerCase();

          const matchVerified =
            !filters.verifiedOnly ||
            item.verified;

          const matchGuardian =
            !filters.guardianOnly ||
            item.guardianRisk ===
              "Low";

          return (
            matchSearch &&
            matchCategory &&
            matchVerified &&
            matchGuardian
          );
        },
      );
    }, [filters, category]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Opportunities
        </h1>

        <p className="text-muted-foreground mt-2">
          Vanguard brings together
          jobs, marketplace,
          investments, services,
          partnerships and business
          opportunities in one
          trusted ecosystem.
        </p>

      </div>

      <OpportunityStats
        data={{
          activeOpportunities: 18425,
          verifiedBusinesses: 3128,
          totalOpportunityValue:
            "₦12.4B",
          successRate: 96,
          guardianProtected: 98,
          todayOpportunities: 486,
        }}
      />

      <OpportunityAssistant
        onSuggestionSelect={(query) =>
          setFilters((prev) => ({
            ...prev,
            search: query,
          }))
        }
      />

      <OpportunityCategories
        selected={category}
        onSelect={setCategory}
      />

      <OpportunityFilters
        value={filters}
        onChange={setFilters}
      />

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            Recommended Opportunities
          </h2>

          <p className="text-muted-foreground">
            Based on your interests,
            trust profile and recent
            activity.
          </p>

        </div>

        <span className="text-sm text-muted-foreground">
          {filtered.length}
          {" "}
          opportunities
        </span>

      </div>

      {filtered.length === 0 ? (

        <div className="rounded-2xl border bg-card p-10 text-center">

          <h3 className="text-xl font-semibold">
            No opportunities found
          </h3>

          <p className="text-muted-foreground mt-2">
            Try changing your
            filters or search.
          </p>

        </div>

      ) : (

        <div className="grid lg:grid-cols-2 gap-6">

          {filtered.map(
            (item) => (
              <OpportunityCard
                key={item.id}
                opportunity={item}
              />
            ),
          )}

        </div>

      )}

      <div className="rounded-2xl border bg-card p-6">

        <h2 className="text-2xl font-bold mb-4">
          🔥 Success Stories
        </h2>

        <div className="space-y-4">

          <div className="rounded-xl border p-4">
            ✅ Sarah got hired as a
            software engineer through
            Vanguard.
          </div>

          <div className="rounded-xl border p-4">
            💰 John sold his vehicle
            using Vanguard Escrow.
          </div>

          <div className="rounded-xl border p-4">
            🚀 A startup raised
            ₦15,000,000 through
            verified investors.
          </div>

          <div className="rounded-xl border p-4">
            🤝 A farmer connected with
            a nationwide distributor.
          </div>

        </div>

      </div>

    </div>
  );
}