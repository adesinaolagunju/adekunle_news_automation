"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Rss,
  Tags,
  Share2,
  History,
  Settings,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/news", label: "News Feed", icon: Rss },
  { href: "/categories", label: "Categories & Filters", icon: Tags },
  { href: "/social", label: "Social Accounts", icon: Share2 },
  { href: "/posts", label: "Post History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-wire-border bg-wire-surface transition-all",
        sidebarOpen ? "w-60" : "w-16"
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-wire-border px-4">
        <Radio className="h-4 w-4 shrink-0 text-wire-signal" />
        {sidebarOpen && (
          <span className="font-display text-sm font-semibold tracking-wide text-wire-text">
            Wire Room
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-wire-signal/10 text-wire-signal"
                  : "text-wire-muted hover:bg-wire-surface2 hover:text-wire-text"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {sidebarOpen && (
        <div className="border-t border-wire-border p-3 text-eyebrow">
          Auto-posting every hour
        </div>
      )}
    </aside>
  );
}
