import { Link, useLocation } from "wouter";
import {
  Home,
  Rss,
  User,
  ShoppingBag,
  Briefcase,
  BookOpen,
  MessageSquare,
  Wallet,
  ShieldCheck,
  Building2,
  Bell,
  Settings,
  LayoutDashboard,
  Bot,
  Layers,
  Wrench,
  Lock,
} from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Feed", icon: Rss, path: "/feed" },
  { label: "Profile", icon: User, path: "/profile" },
  { label: "Marketplace", icon: ShoppingBag, path: "/marketplace" },
  { label: "Services", icon: Wrench, path: "/services" },
  { label: "Jobs", icon: Briefcase, path: "/jobs" },
  { label: "Courses", icon: BookOpen, path: "/courses" },
  { label: "Chat", icon: MessageSquare, path: "/chat" },
  { label: "Wallet", icon: Wallet, path: "/wallet" },
  { label: "Escrow", icon: Layers, path: "/escrow" },
  { label: "Verification", icon: ShieldCheck, path: "/verification" },
  { label: "Company", icon: Building2, path: "/company" },
  { label: "AI", icon: Bot, path: "/ai" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
  { label: "Admin", icon: LayoutDashboard, path: "/admin" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-sidebar-foreground tracking-tight">
              Vanguard
            </span>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const active =
                item.path === "/"
                  ? location === "/"
                  : location.startsWith(item.path);
              return (
                <li key={item.path}>
                  <Link href={item.path}>
                    <span
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                        active
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="px-4 py-3 border-t border-sidebar-border text-xs text-muted-foreground">
          Phase 1 — Skeleton
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
