"use client";

import { useEffect } from "react";
import { Users, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccountStore } from "@/store/useAccountStore";
import { useUIStore } from "@/store/useUIStore";
import { AddAccountDialog } from "@/components/social/AddAccountDialog";

export function AccountSidebar() {
  const accounts = useAccountStore((s) => s.accounts);
  const selectedAccountId = useAccountStore((s) => s.selectedAccountId);
  const selectAccount = useAccountStore((s) => s.selectAccount);
  const fetchAccounts = useAccountStore((s) => s.fetchAccounts);
  const loading = useAccountStore((s) => s.loading);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Only show on desktop when sidebar is open
  if (!sidebarOpen) return null;

  return (
    <aside className="hidden lg:flex h-screen w-48 flex-col border-r border-wire-border bg-wire-surface">
      <div className="flex h-10 items-center gap-2 border-b border-wire-border px-3">
        <Users className="h-3.5 w-3.5 shrink-0 text-wire-signal" />
        <span className="font-display text-xs font-semibold tracking-wide text-wire-text">
          Accounts
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="space-y-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-8 animate-pulse rounded bg-wire-surface2" />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            <button
              onClick={() => selectAccount(null)}
              className={cn(
                "flex w-full items-center justify-between rounded px-2 py-1.5 text-xs transition-colors",
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
                onClick={() => selectAccount(account.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded px-2 py-1.5 text-xs transition-colors",
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

            <div className="pt-2">
              <AddAccountDialog onSuccess={() => fetchAccounts()} />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
