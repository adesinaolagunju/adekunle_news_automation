"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlatformCard } from "@/components/social/PlatformCard";
import { BufferStatusCard } from "@/components/social/BufferStatusCard";
import { TelegramChannelCard } from "@/components/social/TelegramChannelCard";
import { AddTelegramChannelDialog } from "@/components/social/AddTelegramChannelDialog";
import { usePlatformStore } from "@/store/usePlatformStore";
import { useTelegramStore } from "@/store/useTelegramStore";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
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
  const verifyChannel = useTelegramStore((s) => s.verify);
  const testPost = useTelegramStore((s) => s.testPost);
  const syncInfo = useTelegramStore((s) => s.syncInfo);

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

  // ============ Filter Platforms ============
  const nonTelegramPlatforms = platforms.filter((p) => p.name !== "telegram");
  const hasPlatforms = nonTelegramPlatforms.length > 0 || channels.length > 0;

  return (
    <div className="space-y-8">
      {/* ============ Header ============ */}
      <div className="flex items-start justify-between">
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

      {/* ============ Non-Telegram Platforms ============ */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-eyebrow">X · Facebook · Instagram</h2>
        </div>

        {platformsLoading && nonTelegramPlatforms.length === 0 ? (
          <div className="grid gap-3 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : nonTelegramPlatforms.length === 0 ? (
          <Card>
            <CardContent className="text-sm text-wire-muted py-6 text-center">
              <p>No platforms configured.</p>
              <p className="text-xs mt-1">
                Click the &quot;Add Platform&quot; button above to connect X, Facebook, or Instagram.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            {nonTelegramPlatforms.map((p) => (
              <PlatformCard
                key={p.id}
                platform={p}
              />
            ))}
          </div>
        )}
      </section>

      {/* ============ Telegram Channels ============ */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-eyebrow">Telegram Channels</h2>
          <AddTelegramChannelDialog />
        </div>

        {channelsLoading && channels.length === 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : channels.length === 0 ? (
          <Card>
            <CardContent className="text-sm text-wire-muted py-6 text-center">
              <p>No Telegram channels registered yet.</p>
              <p className="text-xs mt-1">
                Click the &quot;Add Channel&quot; button above to connect a Telegram channel.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {channels.map((c) => (
              <TelegramChannelCard
                key={c.id}
                channel={c}
                onVerify={() => verifyChannel(c.id)}
                onTestPost={() => testPost(c.id)}
                onSyncInfo={() => syncInfo(c.id)}
                isBusy={useTelegramStore((s) => s.busyId) === c.id}
                isSyncing={useTelegramStore((s) => s.syncingId) === c.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* ============ Summary Stats ============ */}
      {hasPlatforms && (
        <Card>
          <CardContent className="py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-wire-muted">Total Platforms</p>
                <p className="font-semibold">{platforms.length}</p>
              </div>
              <div>
                <p className="text-wire-muted">Enabled Platforms</p>
                <p className="font-semibold">
                  {platforms.filter((p) => p.enabled).length}
                </p>
              </div>
              <div>
                <p className="text-wire-muted">Telegram Channels</p>
                <p className="font-semibold">{channels.length}</p>
              </div>
              <div>
                <p className="text-wire-muted">Verified Channels</p>
                <p className="font-semibold">
                  {channels.filter((c) => c.is_verified).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}