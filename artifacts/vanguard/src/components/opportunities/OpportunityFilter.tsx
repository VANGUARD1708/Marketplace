import { useState } from "react";
import {
  Search,
  MapPin,
  ShieldCheck,
  SlidersHorizontal,
  CalendarClock,
} from "lucide-react";

export interface OpportunityFiltersValue {
  search: string;
  category: string;
  location: string;
  verifiedOnly: boolean;
  guardianOnly: boolean;
  deadlineWindow: "" | "7d" | "30d" | "90d";
}

interface OpportunityFiltersProps {
  value: OpportunityFiltersValue;
  onChange: (
    value: OpportunityFiltersValue,
  ) => void;
}

const CATEGORIES = [
  "All",
  "Jobs",
  "Marketplace",
  "Services",
  "Investments",
  "Partnerships",
  "Courses",
];

const LOCATIONS = [
  "Anywhere",
  "Nearby",
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Kano",
  "Enugu",
];

export default function OpportunityFilters({
  value,
  onChange,
}: OpportunityFiltersProps) {
  const [expanded, setExpanded] =
    useState(false);

  function update(
    field: keyof OpportunityFiltersValue,
    newValue: string | boolean,
  ) {
    onChange({
      ...value,
      [field]: newValue,
    });
  }

  return (
    <div className="rounded-2xl border bg-card p-5">

      <div className="relative mb-4">

        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        <input
          value={value.search}
          onChange={(e) =>
            update(
              "search",
              e.target.value,
            )
          }
          placeholder="Search opportunities..."
          className="w-full rounded-xl border bg-background pl-10 pr-4 py-3 text-sm"
        />

      </div>

      <div className="grid md:grid-cols-2 gap-3">

        <select
          value={value.category}
          onChange={(e) =>
            update(
              "category",
              e.target.value,
            )
          }
          className="rounded-xl border px-3 py-3"
        >
          {CATEGORIES.map(
            (category) => (
              <option
                key={category}
              >
                {category}
              </option>
            ),
          )}
        </select>

        <select
          value={value.location}
          onChange={(e) =>
            update(
              "location",
              e.target.value,
            )
          }
          className="rounded-xl border px-3 py-3"
        >
          {LOCATIONS.map(
            (location) => (
              <option
                key={location}
              >
                {location}
              </option>
            ),
          )}
        </select>

      </div>

      <div className="mt-3">
        <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
          <CalendarClock className="h-3.5 w-3.5" /> Closing deadline
        </label>
        <select
          value={value.deadlineWindow}
          onChange={(e) =>
            update("deadlineWindow", e.target.value as OpportunityFiltersValue["deadlineWindow"])
          }
          className="rounded-xl border px-3 py-2.5 w-full text-sm"
        >
          <option value="">Any time</option>
          <option value="7d">Closing in 7 days</option>
          <option value="30d">Closing in 30 days</option>
          <option value="90d">Closing in 90 days</option>
        </select>
      </div>

      <button
        onClick={() =>
          setExpanded(
            !expanded,
          )
        }
        className="mt-4 flex items-center gap-2 text-sm font-medium"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Advanced Filters
      </button>

      {expanded && (

        <div className="grid md:grid-cols-2 gap-3 mt-4">

          <label className="flex items-center gap-2 rounded-xl border p-3 cursor-pointer">

            <input
              type="checkbox"
              checked={
                value.verifiedOnly
              }
              onChange={(e) =>
                update(
                  "verifiedOnly",
                  e.target.checked,
                )
              }
            />

            <ShieldCheck className="h-4 w-4 text-primary" />

            Verified Only

          </label>

          <label className="flex items-center gap-2 rounded-xl border p-3 cursor-pointer">

            <input
              type="checkbox"
              checked={
                value.guardianOnly
              }
              onChange={(e) =>
                update(
                  "guardianOnly",
                  e.target.checked,
                )
              }
            />

            🛡 Guardian Protected

          </label>

          <div className="rounded-xl border p-3">

            <div className="flex items-center gap-2 mb-2">

              <MapPin className="h-4 w-4" />

              <span className="text-sm font-medium">
                Distance
              </span>

            </div>

            <input
              type="range"
              min="1"
              max="100"
              defaultValue="25"
              className="w-full"
            />

            <div className="flex justify-between text-xs text-muted-foreground mt-1">

              <span>1 km</span>

              <span>100 km</span>

            </div>

          </div>

          <div className="rounded-xl border p-3">

            <p className="text-sm font-medium mb-2">
              Sort By
            </p>

            <select className="w-full rounded-lg border px-2 py-2">

              <option>
                Best Match
              </option>

              <option>
                Latest
              </option>

              <option>
                Highest Value
              </option>

              <option>
                Most Trusted
              </option>

              <option>
                Trending
              </option>

            </select>

          </div>

        </div>

      )}

    </div>
  );
}