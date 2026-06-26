import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  Home, ShoppingBag, MessageCircle, Wallet, User,
  BarChart3, Settings, Shield, Users, AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarLayoutProps {
  children: ReactNode;
  variant?: "default" | "admin";
}

const DEFAULT_NAV = [
  { href: "/", icon: Home, label: "Feed" },
  { href: "/marketplace", icon: ShoppingBag, label: "Marketplace" },
  { href: "/chat", icon: MessageCircle, label: "Messages" },
  { href: "/wallet", icon: Wallet, label: "Wallet" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

const ADMIN_NAV = [
  { href: "/admin", icon: BarChart3, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/listings", icon: ShoppingBag, label: "Listings" },
  { href: "/admin/disputes", icon: AlertTriangle, label: "Disputes" },
  { href: "/admin/guardian", icon: Shield, label: "Guardian AI" },
];

export function SidebarLayout({ children, variant = "default" }: SidebarLayoutProps) {
  const [location] = useLocation();
  const navItems = variant === "admin" ? ADMIN_NAV : DEFAULT_NAV;

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex flex-col w-56 border-r bg-background sticky top-0 h-screen">
        <div className="px-4 py-5">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Vanguard</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 pb-4 space-y-0.5">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = location === href || (href !== "/" && location.startsWith(href));
            return (
              <Link key={href} href={href} className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}>
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
