import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  Home, ShoppingBag, MessageCircle, Wallet, User,
  Bell, Search, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  actions?: ReactNode;
}

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Feed" },
  { href: "/marketplace", icon: ShoppingBag, label: "Market" },
  { href: "/chat", icon: MessageCircle, label: "Chat" },
  { href: "/wallet", icon: Wallet, label: "Wallet" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function PageLayout({ children, title, showBack, actions }: PageLayoutProps) {
  const [location] = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 py-3">
          {showBack && (
            <button onClick={() => history.back()} className="p-1 rounded-lg hover:bg-muted">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {title ? (
            <h1 className="flex-1 font-semibold text-base">{title}</h1>
          ) : (
            <Link href="/" className="flex-1 flex items-center gap-1.5">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-bold text-base">Vanguard</span>
            </Link>
          )}
          <div className="flex items-center gap-1">
            {actions}
            <Link href="/search" className="p-2 rounded-lg hover:bg-muted">
              <Search className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Link href="/notifications" className="p-2 rounded-lg hover:bg-muted relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pb-24">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/90 backdrop-blur">
        <div className="max-w-2xl mx-auto flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = location === href || (href !== "/" && location.startsWith(href));
            return (
              <Link key={href} href={href} className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}>
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
