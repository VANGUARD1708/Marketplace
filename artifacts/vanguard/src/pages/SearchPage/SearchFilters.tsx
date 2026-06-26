import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

type Filters = {
  minPrice: string;
  maxPrice: string;
  condition: string;
  location: string;
  verified: boolean;
};

type SearchFiltersProps = {
  value: Filters;
  onChange: (filters: Filters) => void;
  open: boolean;
  onToggle: () => void;
};

const CONDITIONS = [
  { value: "", label: "Any" },
  { value: "new", label: "New" },
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];

const NG_STATES = ["", "Lagos", "Abuja", "Kano", "Rivers", "Ogun", "Anambra", "Edo", "Delta", "Imo"];

const EMPTY_FILTERS: Filters = { minPrice: "", maxPrice: "", condition: "", location: "", verified: false };

function hasActiveFilters(f: Filters): boolean {
  return !!(f.minPrice || f.maxPrice || f.condition || f.location || f.verified);
}

export function SearchFilters({ value, onChange, open, onToggle }: SearchFiltersProps) {
  function update(partial: Partial<Filters>) {
    onChange({ ...value, ...partial });
  }

  function reset() {
    onChange(EMPTY_FILTERS);
  }

  const active = hasActiveFilters(value);

  return (
    <div>
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${open ? "bg-accent border-border" : "hover:bg-muted"} ${active ? "border-primary text-primary" : ""}`}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filters
        {active && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
      </button>

      {open && (
        <div className="rounded-2xl border bg-card p-4 mt-3 grid grid-cols-2 gap-3">
          <div className="col-span-2 flex items-center justify-between mb-1">
            <span className="text-sm font-semibold">Filter Results</span>
            {active && (
              <button onClick={reset} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition">
                <X className="h-3 w-3" /> Clear all
              </button>
            )}
          </div>

          <div>
            <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Min Price (₦)</label>
            <input
              type="number"
              placeholder="0"
              value={value.minPrice}
              onChange={(e) => update({ minPrice: e.target.value })}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Max Price (₦)</label>
            <input
              type="number"
              placeholder="Any"
              value={value.maxPrice}
              onChange={(e) => update({ maxPrice: e.target.value })}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Condition</label>
            <select
              value={value.condition}
              onChange={(e) => update({ condition: e.target.value })}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none"
            >
              {CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium mb-1.5 block text-muted-foreground">State</label>
            <select
              value={value.location}
              onChange={(e) => update({ location: e.target.value })}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none"
            >
              {NG_STATES.map((s) => <option key={s} value={s}>{s || "All States"}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value.verified}
                onChange={(e) => update({ verified: e.target.checked })}
                className="rounded border-border"
              />
              <span className="text-sm">Verified sellers only</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchFilters;
