import {
  Eye,
  Heart,
  MessageCircle,
  Zap,
  Flame,
} from "lucide-react";

export type ActivityBadgeType =
  | "views"
  | "saves"
  | "chats"
  | "offers"
  | "trending";

interface ActivityBadgeProps {
  type: ActivityBadgeType;
  value?: number;
}

const activityConfig = {
  views: {
    label: "Views",
    icon: Eye,
    className:
      "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },

  saves: {
    label: "Saves",
    icon: Heart,
    className:
      "bg-pink-500/10 text-pink-500 border-pink-500/20",
  },

  chats: {
    label: "Chats",
    icon: MessageCircle,
    className:
      "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },

  offers: {
    label: "Offers",
    icon: Zap,
    className:
      "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },

  trending: {
    label: "Trending",
    icon: Flame,
    className:
      "bg-orange-500/10 text-orange-500 border-orange-500/20",
  },
};

export default function ActivityBadge({
  type,
  value,
}: ActivityBadgeProps) {
  const config =
    activityConfig[type];

  const Icon =
    config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />

      {type === "trending"
        ? config.label
        : `${value ?? 0} ${config.label}`}
    </div>
  );
}