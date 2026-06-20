import {
  Bell,
  MessageSquare,
  ShoppingBag,
  Shield,
  Star,
  CheckCircle,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "New Message",
    description:
      "John Electronics sent you a message.",
    time: "2 min ago",
    icon: MessageSquare,
  },
  {
    id: 2,
    title: "New Order",
    description:
      "A buyer placed an order on your listing.",
    time: "10 min ago",
    icon: ShoppingBag,
  },
  {
    id: 3,
    title: "Escrow Update",
    description:
      "Funds have been locked in escrow.",
    time: "1 hour ago",
    icon: Shield,
  },
  {
    id: 4,
    title: "New Review",
    description:
      "You received a 5-star review.",
    time: "3 hours ago",
    icon: Star,
  },
  {
    id: 5,
    title: "Verification Approved",
    description:
      "Your account has been verified.",
    time: "Yesterday",
    icon: CheckCircle,
  },
];

export default function NotificationsPage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Notifications
        </h1>

        <p className="text-muted-foreground">
          Stay updated with your activity.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">
            Total Notifications
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
          Escrow
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map(
          (notification) => (
            <div
              key={notification.id}
              className="rounded-xl border bg-card p-4 flex gap-4"
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
          )
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