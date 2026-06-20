import { useState } from "react";
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
  Menu,
  X,
  Plus,
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

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [location, navigate] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="h-14 shrink-0 flex items-center gap-3 px-4 border-b border-border bg-sidebar">
        <button
          onClick={() => setOpen(true)}
          className="p-1.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary" />
          <span className="text-base font-bold text-sidebar-foreground tracking-tight">
            Vanguard
          </span>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            <span className="text-base font-bold text-sidebar-foreground tracking-tight">
              Vanguard
            </span>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
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
                      onClick={() => setOpen(false)}
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
          Phase 1 — Marketplace Active
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      <button
        onClick={() => navigate("/create-listing")}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
        aria-label="Create Listing"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}