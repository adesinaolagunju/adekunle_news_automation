"use client";

import { useEffect } from "react";
import { Loader2, CheckCircle, LogOut, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBufferStore } from "@/store/useBufferStore";
import { AddPlatformDialog } from "@/components/social/AddPlatformDialog";

export function BufferStatusCard() {
  const account = useBufferStore((s) => s.account);
  const profiles = useBufferStore((s) => s.profiles);
  const loading = useBufferStore((s) => s.loading);
  const testing = useBufferStore((s) => s.testing);
  const disconnecting = useBufferStore((s) => s.disconnecting);
  const fetchStatus = useBufferStore((s) => s.fetchStatus);
  const fetchProfiles = useBufferStore((s) => s.fetchProfiles);
  const testConnection = useBufferStore((s) => s.testConnection);
  const disconnect = useBufferStore((s) => s.disconnect);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    if (account?.connected) {
      fetchProfiles();
    }
  }, [account?.connected, fetchProfiles]);

  async function handleTest() {
    await testConnection();
    await fetchStatus();
  }

  async function handleDisconnect() {
    const ok = await disconnect();
    if (ok) {
      fetchStatus();
    }
  }

  function handleConnectSuccess() {
    fetchStatus();
    fetchProfiles();
  }

  if (loading && !account) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-wire-muted" />
        </CardContent>
      </Card>
    );
  }

  if (account?.connected) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#405DE6] via-[#5851DB] to-[#E4405F] text-white">
                <span className="text-lg font-bold">B</span>
              </div>
              <div className="min-w-0">
                <div className="font-display text-sm font-semibold text-wire-text">
                  Buffer Connection
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge tone="success" className="text-xs gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Connected
                  </Badge>
                  {account.token_expires_at && (
                    <span className="text-xs text-wire-muted">
                      Token expires {new Date(account.token_expires_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {account.api_url && (
                  <div className="mt-1.5">
                    <span className="text-xs text-wire-muted">News API: </span>
                    <span className="text-xs text-wire-text font-mono break-all">{account.api_url}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTest}
                disabled={testing}
                title="Test Buffer connection"
              >
                {testing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDisconnect}
                disabled={disconnecting}
                title="Disconnect Buffer"
              >
                {disconnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-wire-danger" />
                ) : (
                  <LogOut className="h-4 w-4 text-wire-danger" />
                )}
              </Button>
            </div>
          </div>

          {profiles.length > 0 && (
            <div className="mt-3 border-t border-wire-border pt-3 space-y-1.5">
              <p className="text-xs font-medium text-wire-muted uppercase tracking-wider">
                Connected Profiles
              </p>
              <div className="flex flex-wrap gap-2">
                {profiles.map((profile, i) => (
                  <div key={profile.id ?? i} className="flex items-center gap-2 text-xs text-wire-text">
                    {profile.avatar && (
                      <img src={profile.avatar} alt="" className="h-4 w-4 rounded-full" />
                    )}
                    <span>{profile.service_username || profile.formatted_username || profile.service}</span>
                    {profile.default && (
                      <Badge tone="success" className="text-[10px]">default</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="py-6 text-center space-y-3">
        <p className="text-sm text-wire-muted">
          Connect a Buffer account to enable posting to X, Facebook, and Instagram.
        </p>
        <AddPlatformDialog onSuccess={handleConnectSuccess} />
      </CardContent>
    </Card>
  );
}
