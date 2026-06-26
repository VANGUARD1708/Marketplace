import {
  Briefcase,
  ShoppingBag,
  Wrench,
  Landmark,
  GraduationCap,
  Users,
  Building2,
  Trophy,
  BookOpen,
  Rocket,
  Landmark as Govt,
  UserSquare,
} from "lucide-react";

export type OpportunityCategory =
  | "All"
  | "Jobs"
  | "Marketplace"
  | "Services"
  | "Investments"
  | "Courses"
  | "Partnerships"
  | "Grants"
  | "Scholarships"
  | "Competitions"
  | "Internships"
  | "Government"
  | "Startup Funding";

interface OpportunityCategoriesProps {
  selected: OpportunityCategory;
  onSelect: (category: OpportunityCategory) => void;
}

const categories: { name: OpportunityCategory; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { name: "All", icon: Building2, color: "bg-slate-500/10 text-slate-500" },
  { name: "Jobs", icon: Briefcase, color: "bg-blue-500/10 text-blue-500" },
  { name: "Marketplace", icon: ShoppingBag, color: "bg-green-500/10 text-green-500" },
  { name: "Services", icon: Wrench, color: "bg-orange-500/10 text-orange-500" },
  { name: "Investments", icon: Landmark, color: "bg-emerald-500/10 text-emerald-600" },
  { name: "Courses", icon: GraduationCap, color: "bg-purple-500/10 text-purple-500" },
  { name: "Partnerships", icon: Users, color: "bg-pink-500/10 text-pink-500" },
  { name: "Grants", icon: BookOpen, color: "bg-teal-500/10 text-teal-600" },
  { name: "Scholarships", icon: GraduationCap, color: "bg-indigo-500/10 text-indigo-600" },
  { name: "Competitions", icon: Trophy, color: "bg-yellow-500/10 text-yellow-600" },
  { name: "Internships", icon: UserSquare, color: "bg-cyan-500/10 text-cyan-600" },
  { name: "Government", icon: Govt, color: "bg-red-500/10 text-red-500" },
  { name: "Startup Funding", icon: Rocket, color: "bg-violet-500/10 text-violet-600" },
];

import React from "react";

export default function OpportunityCategories({
  selected,
  onSelect,
}: OpportunityCategoriesProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {categories.map((category) => {
        const Icon = category.icon;
        const active = selected === category.name;

        return (
          <button
            key={category.name}
            onClick={() => onSelect(category.name)}
            className={`rounded-2xl border p-3 transition-all hover:shadow-lg text-center ${
              active ? "border-primary bg-primary/5" : "bg-card"
            }`}
          >
            <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${category.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-2 font-semibold text-xs leading-tight">{category.name}</h3>
          </button>
        );
      })}
    </div>
  );
}
