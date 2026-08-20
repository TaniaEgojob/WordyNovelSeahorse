import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Activity, LayoutDashboard, Radar, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/scanner", label: "Opportunity Radar", icon: Radar },
  { href: "/trades", label: "Paper Trades", icon: ArrowLeftRight },
  { href: "/strategies", label: "Strategies", icon: Activity },
];

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-[100dvh] w-full bg-background flex-col md:flex-row">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-sidebar flex-shrink-0 flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-border/10 bg-sidebar-primary text-sidebar-primary-foreground">
          <div className="flex items-center gap-2 font-bold tracking-tight">
            <Activity className="h-5 w-5 text-sidebar-ring" />
            <span>MarketPilot</span>
          </div>
        </div>
        <nav className="flex-1 overflow-auto py-4 px-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible hide-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className="flex-shrink-0">
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.label}</span>
                  <span className="inline md:hidden">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 h-[100dvh] md:h-auto overflow-auto">
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
