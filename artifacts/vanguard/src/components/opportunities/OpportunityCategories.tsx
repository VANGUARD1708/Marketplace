import {
  Briefcase,
  ShoppingBag,
  Wrench,
  Landmark,
  GraduationCap,
  Users,
  Building2,
  HeartPulse,
  Cpu,
  Tractor,
} from "lucide-react";

export type OpportunityCategory =
  | "All"
  | "Jobs"
  | "Marketplace"
  | "Services"
  | "Investments"
  | "Courses"
  | "Partnerships"
  | "Engineering"
  | "Medical"
  | "Technology"
  | "Agriculture";

interface OpportunityCategoriesProps {
  selected: OpportunityCategory;
  onSelect: (
    category: OpportunityCategory,
  ) => void;
}

const categories = [
  {
    name: "All",
    icon: Building2,
    color: "bg-slate-500/10 text-slate-500",
  },
  {
    name: "Jobs",
    icon: Briefcase,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    name: "Marketplace",
    icon: ShoppingBag,
    color: "bg-green-500/10 text-green-500",
  },
  {
    name: "Services",
    icon: Wrench,
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    name: "Investments",
    icon: Landmark,
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    name: "Courses",
    icon: GraduationCap,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    name: "Partnerships",
    icon: Users,
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    name: "Engineering",
    icon: Cpu,
    color: "bg-cyan-500/10 text-cyan-600",
  },
  {
    name: "Medical",
    icon: HeartPulse,
    color: "bg-red-500/10 text-red-500",
  },
  {
    name: "Agriculture",
    icon: Tractor,
    color: "bg-lime-500/10 text-lime-600",
  },
] as const;

export default function OpportunityCategories({
  selected,
  onSelect,
}: OpportunityCategoriesProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {categories.map((category) => {
        const Icon = category.icon;

        const active =
          selected === category.name;

        return (
          <button
            key={category.name}
            onClick={() =>
              onSelect(
                category.name as OpportunityCategory,
              )
            }
            className={`rounded-2xl border p-5 transition-all hover:shadow-lg ${
              active
                ? "border-primary bg-primary/5"
                : "bg-card"
            }`}
          >
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${category.color}`}
            >
              <Icon className="h-7 w-7" />
            </div>

            <h3 className="mt-4 font-semibold">
              {category.name}
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Explore {category.name}
            </p>
          </button>
        );
      })}
    </div>
  );
}