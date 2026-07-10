"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BufferStatusCard } from "@/components/social/BufferStatusCard";
import { usePlatformStore } from "@/store/usePlatformStore";
import { useTelegramStore } from "@/store/useTelegramStore";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function SocialAccountsPage() {
  // ============ Platform Store ============
  const platforms = usePlatformStore((s) => s.items);
  const platformsLoading = usePlatformStore((s) => s.loading);
  const fetchPlatforms = usePlatformStore((s) => s.fetchAll);

  // ============ Telegram Store ============
  const channels = useTelegramStore((s) => s.items);
  const channelsLoading = useTelegramStore((s) => s.loading);
  const fetchChannels = useTelegramStore((s) => s.fetchAll);

  // ============ Fetch Data ============
  useEffect(() => {
    fetchPlatforms();
    fetchChannels();
  }, [fetchPlatforms, fetchChannels]);

  // ============ Handlers ============
  const handleRefreshAll = async () => {
    await Promise.all([fetchPlatforms(), fetchChannels()]);
    toast.success("All data refreshed");
  };

  return (
    <div className="space-y-6">
      {/* ============ Header ============ */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-wire-text">
            Social Accounts
          </h1>
          <p className="text-sm text-wire-muted">
            Register, enable, or remove the destinations news gets posted to every hour.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshAll}
          disabled={platformsLoading || channelsLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${(platformsLoading || channelsLoading) ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* ============ Buffer Connection ============ */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-eyebrow">Buffer Connection</h2>
        </div>
        <BufferStatusCard />
      </section>
    </div>
  );
}
