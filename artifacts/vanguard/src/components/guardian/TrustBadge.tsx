import { Shield, Star, Building2, CheckCircle2, Lock } from "lucide-react";

export type TrustBadgeType =
  | "verified_user"
  | "trusted_seller"
  | "verified_company"
  | "top_rated"
  | "guardian_protected";

interface TrustBadgeProps {
  badge: TrustBadgeType;
}

const badgeConfig: Record<TrustBadgeType, { label: string; icon: React.ElementType; className: string }> = {
  verified_user: { label: "Verified User", icon: CheckCircle2, className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  trusted_seller: { label: "Trusted Seller", icon: Shield, className: "bg-green-500/10 text-green-500 border-green-500/20" },
  verified_company: { label: "Verified Company", icon: Building2, className: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  top_rated: { label: "Top Rated", icon: Star, className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  guardian_protected: { label: "Guardian Protected", icon: Lock, className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
};

export default function TrustBadge({ badge }: TrustBadgeProps) {
  const { label, icon: Icon, className } = badgeConfig[badge];
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${className}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
  );
}
