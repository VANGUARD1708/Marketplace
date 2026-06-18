export default function NotificationsPage() {
  const items = [
    { label: "New Message", desc: "You have a new message from a user." },
    { label: "New Order", desc: "Someone placed a new order on your listing." },
    { label: "New Review", desc: "You received a new review." },
    { label: "Escrow Update", desc: "An escrow transaction has been updated." },
    { label: "Verification Update", desc: "Your verification request has been updated." },
  ];
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => {
          const item = items[i % items.length];
          return (
            <div key={i} className="flex items-start gap-4 rounded-lg border bg-card p-4">
              <div className="h-9 w-9 rounded-full bg-muted shrink-0" />
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc} — placeholder</p>
                <p className="text-xs text-muted-foreground mt-1">Just now</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
