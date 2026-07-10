"use client";

import { useRouter } from "next/navigation";
import { Menu, LogOut, Radio } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useStatsStore } from "@/store/useStatsStore";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { authApi } from "@/lib/api/auth";
import { useEffect } from "react";

export function Header() {
  const router = useRouter();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const dashboard = useStatsStore((s) => s.dashboard);
  const fetchDashboard = useStatsStore((s) => s.fetchDashboard);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 60_000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  async function handleLogout() {
    try {
      await authApi.logout();
    } catch {
      // ignore — logging out client-side regardless
    }
    logout();
    router.replace("/login");
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-wire-border bg-wire-surface px-3 sm:px-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-4 w-4" />
        </Button>
        <div className="hidden items-center gap-2 font-mono text-xs text-wire-muted md:flex">
          <Radio className="h-3 w-3 text-wire-success" />
          <span>NEXT RUN:</span>
          <span className="text-wire-text">
            {dashboard?.next_run ? formatDateTime(dashboard.next_run) : "—"}
          </span>
          <span className="mx-2 text-wire-border">|</span>
          <span>LAST RUN:</span>
          <span className="text-wire-text">
            {dashboard?.last_run ? formatDateTime(dashboard.last_run) : "—"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-xs sm:text-sm text-wire-muted">{user?.username}</span>
        <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign out">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
