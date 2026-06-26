import {
  Bell,
  MessageSquare,
  ShoppingBag,
  Shield,
  Star,
  CheckCircle,
  TrendingUp,
  Users,
  Wallet,
  Briefcase,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "🔥 Listing Trending",
    description:
      "Your iPhone listing gained 120 new views today.",
    time: "2 min ago",
    icon: TrendingUp,
  },
  {
    id: 2,
    title: "New Message",
    description:
      "John Electronics sent you a message.",
    time: "5 min ago",
    icon: MessageSquare,
  },
  {
    id: 3,
    title: "New Offer",
    description:
      "A buyer submitted an offer on your listing.",
    time: "15 min ago",
    icon: ShoppingBag,
  },
  {
    id: 4,
    title: "Escrow Protected",
    description:
      "Funds have been locked successfully.",
    time: "1 hour ago",
    icon: Shield,
  },
  {
    id: 5,
    title: "Trust Score Increased",
    description:
      "Your trust score increased from 85 to 89.",
    time: "2 hours ago",
    icon: Star,
  },
  {
    id: 6,
    title: "New Follower",
    description:
      "3 users started following your profile.",
    time: "4 hours ago",
    icon: Users,
  },
  {
    id: 7,
    title: "Wallet Credit",
    description:
      "₦25,000 has been credited to your wallet.",
    time: "Yesterday",
    icon: Wallet,
  },
  {
    id: 8,
    title: "Job Match",
    description:
      "A new job matches your profile.",
    time: "Yesterday",
    icon: Briefcase,
  },
  {
    id: 9,
    title: "Verification Approved",
    description:
      "Your account verification was approved.",
    time: "2 days ago",
    icon: CheckCircle,
  },
];

export default function NotificationsPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Notifications
        </h1>

        <p className="text-muted-foreground">
          Stay updated with activity across Vanguard.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">
            Total
          </p>

          <p className="text-2xl font-bold">
            24
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">
            Unread
          </p>

          <p className="text-2xl font-bold">
            5
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">
            Today
          </p>

          <p className="text-2xl font-bold">
            8
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">
            Trending Alerts
          </p>

          <p className="text-2xl font-bold">
            3
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground">
          All
        </button>

        <button className="px-4 py-2 rounded-md border">
          Messages
        </button>

        <button className="px-4 py-2 rounded-md border">
          Orders
        </button>

        <button className="px-4 py-2 rounded-md border">
          Trust
        </button>

        <button className="px-4 py-2 rounded-md border">
          Wallet
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map(
          (notification) => (
            <div
              key={notification.id}
              className="rounded-xl border bg-card p-4 flex gap-4 hover:shadow-md transition"
            >
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <notification.icon className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">
                    {notification.title}
                  </p>

                  <span className="text-xs text-muted-foreground">
                    {notification.time}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mt-1">
                  {notification.description}
                </p>
              </div>
            </div>
          ),
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <button className="flex items-center gap-2 px-4 py-2 rounded-md border">
          <Bell className="h-4 w-4" />
          Mark All as Read
        </button>
      </div>
    </div>
  );
}