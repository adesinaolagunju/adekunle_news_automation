"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Rss,
  Tags,
  Share2,
  History,
  Radio,
  X,
  Users,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";
import { useAccountStore } from "@/store/useAccountStore";
import { AddAccountDialog } from "@/components/social/AddAccountDialog";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/news", label: "News Feed", icon: Rss },
  { href: "/categories", label: "Categories & Filters", icon: Tags },
  { href: "/social", label: "Social Accounts", icon: Share2 },
  { href: "/posts", label: "Post History", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const accounts = useAccountStore((s) => s.accounts);
  const selectedAccountId = useAccountStore((s) => s.selectedAccountId);
  const selectAccount = useAccountStore((s) => s.selectAccount);
  const fetchAccounts = useAccountStore((s) => s.fetchAccounts);
  const accountsLoading = useAccountStore((s) => s.loading);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-wire-border bg-wire-surface transition-all lg:relative lg:z-auto",
          sidebarOpen ? "w-72" : "w-0 overflow-hidden lg:w-16"
        )}
      >
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-wire-border px-4 lg:justify-start">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 shrink-0 text-wire-signal" />
            {sidebarOpen && (
              <span className="font-display text-sm font-semibold tracking-wide text-wire-text">
                Wire Room
              </span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="text-wire-muted hover:text-wire-text lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto">
          {/* Navigation */}
          <nav className="space-y-1 p-2">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) toggleSidebar();
                  }}
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

          {/* Accounts section — mobile only */}
          {sidebarOpen && (
            <div className="border-t border-wire-border p-2 lg:hidden">
              <div className="flex items-center gap-2 px-3 py-2">
                <Users className="h-3.5 w-3.5 shrink-0 text-wire-signal" />
                <span className="font-display text-xs font-semibold tracking-wide text-wire-text">
                  Accounts
                </span>
              </div>

              {accountsLoading ? (
                <div className="space-y-1 px-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-8 animate-pulse rounded bg-wire-surface2" />
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      selectAccount(null);
                      if (window.innerWidth < 1024) toggleSidebar();
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded px-5 py-1.5 text-xs transition-colors",
                      selectedAccountId === null
                        ? "bg-wire-signal/10 text-wire-signal"
                        : "text-wire-muted hover:bg-wire-surface2 hover:text-wire-text"
                    )}
                  >
                    <span className="truncate">All Accounts</span>
                    {selectedAccountId === null && (
                      <Check className="h-3 w-3 shrink-0" />
                    )}
                  </button>

                  {accounts.map((account) => (
                    <button
                      key={account.id}
                      onClick={() => {
                        selectAccount(account.id);
                        if (window.innerWidth < 1024) toggleSidebar();
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded px-5 py-1.5 text-xs transition-colors",
                        selectedAccountId === account.id
                          ? "bg-wire-signal/10 text-wire-signal"
                          : "text-wire-muted hover:bg-wire-surface2 hover:text-wire-text"
                      )}
                    >
                      <span className="truncate">
                        {account.name || `Account ${account.id}`}
                      </span>
                      <span className="ml-1 shrink-0 text-[10px] text-wire-muted">
                        {account.news_count}
                      </span>
                    </button>
                  ))}

                  <div className="px-3 pt-2">
                    <AddAccountDialog onSuccess={() => fetchAccounts()} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer — desktop only */}
          {sidebarOpen && (
            <div className="hidden border-t border-wire-border p-3 text-eyebrow lg:block">
              Auto-posting every hour
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
