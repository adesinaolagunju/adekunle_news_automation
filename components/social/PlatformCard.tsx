"use client";

import { useState, useEffect } from "react";
import { Settings2, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SocialPlatform, PlatformConnectionStatus } from "@/lib/types";
import { usePlatformStore } from "@/store/usePlatformStore";
import { toast } from "sonner";

const PLATFORM_LABEL: Record<string, string> = {
  twitter: "X (Twitter)",
  facebook: "Facebook",
  instagram: "Instagram",
  telegram: "Telegram",
};

const PLATFORM_ICONS: Record<string, string> = {
  twitter: "🐦",
  facebook: "👍",
  instagram: "📸",
  telegram: "📱",
};

const PLATFORM_COLORS: Record<string, string> = {
  twitter: "bg-black",
  facebook: "bg-[#1877F2]",
  instagram: "bg-gradient-to-r from-[#405DE6] via-[#5851DB] to-[#E4405F]",
  telegram: "bg-[#26A5E4]",
};

interface PlatformCardProps {
  platform: SocialPlatform;
}

export function PlatformCard({ platform }: PlatformCardProps) {
  const toggle = usePlatformStore((s) => s.toggle);
  const update = usePlatformStore((s) => s.update);
  const fetchAll = usePlatformStore((s) => s.fetchAll);
  const fetchConnectionStatus = usePlatformStore((s) => s.fetchConnectionStatus);
  const connectionStatus = usePlatformStore((s) => s.connectionStatus);

  const [configText, setConfigText] = useState(
    JSON.stringify(platform.config ?? {}, null, 2)
  );
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [statusDetails, setStatusDetails] = useState<PlatformConnectionStatus | null>(null);

  // Load connection status when component mounts
  useEffect(() => {
    if (platform.enabled) {
      fetchConnectionStatus(platform.id);
    }
  }, [platform.id, platform.enabled]);

  // Update status details when connection status changes
  useEffect(() => {
    if (connectionStatus[platform.id]) {
      setStatusDetails(connectionStatus[platform.id]);
    }
  }, [connectionStatus, platform.id]);

  const statusTone = platform.status === "connected" || platform.status === "configured"
    ? "success"
    : "muted";

  const getStatusIcon = () => {
    if (!platform.enabled) {
      return <XCircle className="h-4 w-4 text-gray-400" />;
    }
    if (platform.status === "connected") {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-gray-400" />;
  };

  const getStatusLabel = () => {
    if (!platform.enabled) return "Disabled";
    if (platform.status === "connected") return "Connected";
    if (platform.status === "configured") return "Configured";
    return platform.status.replace("_", " ");
  };

  async function handleSave() {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(configText);
    } catch {
      toast.error("Config must be valid JSON");
      return;
    }
    setSaving(true);
    try {
      await update(platform.id, { config: parsed });
      toast.success(`${PLATFORM_LABEL[platform.name] ?? platform.name} credentials saved`);
      setOpen(false);
      await fetchAll();
    } catch (err) {
      // Error is handled by the store
    } finally {
      setSaving(false);
    }
  }

  const getPlatformConfigFields = () => {
    const fields: Record<string, { label: string; type: string; help?: string }> = {
      twitter: {
        api_key: { label: "API Key", type: "password" },
        api_secret: { label: "API Secret", type: "password" },
        access_token: { label: "Access Token", type: "password" },
        access_token_secret: { label: "Access Token Secret", type: "password" },
      },
      facebook: {
        page_id: { label: "Page ID", type: "text" },
        access_token: { label: "Access Token", type: "password" },
      },
      instagram: {
        business_account_id: { label: "Business Account ID", type: "text" },
        access_token: { label: "Access Token", type: "password" },
      },
      telegram: {
        bot_token: { label: "Bot Token", type: "password", help: "Get from @BotFather" },
        channel_chat_id: { label: "Channel Chat ID", type: "text", help: "Negative number (e.g., -1001234567890)" },
        channel_username: { label: "Channel Username", type: "text", help: "Optional (e.g., @UbuntuNews)" },
      },
    };
    return fields[platform.name] || {};
  };

  const renderConfigFields = () => {
    const fields = getPlatformConfigFields();
    const config = platform.config || {};

    if (Object.keys(fields).length === 0) {
      return (
        <div className="space-y-2">
          <Label>Config (JSON)</Label>
          <textarea
            value={configText}
            onChange={(e) => setConfigText(e.target.value)}
            rows={8}
            className="w-full rounded border border-wire-border bg-wire-surface2 p-2 font-mono text-xs text-wire-text focus-visible:outline-none focus-visible:border-wire-signal/60"
          />
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <p className="text-sm text-wire-muted">Configure your credentials:</p>
        {Object.entries(fields).map(([key, field]) => (
          <div key={key} className="space-y-1">
            <Label htmlFor={`config-${key}`}>{field.label}</Label>
            <input
              id={`config-${key}`}
              type={field.type}
              value={config[key] || ""}
              onChange={(e) => {
                const newConfig = { ...config, [key]: e.target.value };
                setConfigText(JSON.stringify(newConfig, null, 2));
              }}
              className="w-full rounded border border-wire-border bg-wire-surface2 p-2 text-sm text-wire-text focus-visible:outline-none focus-visible:border-wire-signal/60"
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
            {field.help && (
              <p className="text-xs text-wire-muted">{field.help}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className={!platform.enabled ? "opacity-60" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-white ${PLATFORM_COLORS[platform.name] || "bg-gray-500"}`}>
              <span className="text-lg">{PLATFORM_ICONS[platform.name] || "📡"}</span>
            </div>
            <div>
              <div className="font-display text-sm font-semibold text-wire-text">
                {PLATFORM_LABEL[platform.name] ?? platform.name}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge tone={statusTone as any} className="text-xs">
                  {getStatusIcon()}
                  <span className="ml-1">{getStatusLabel()}</span>
                </Badge>
                {platform.total_posts !== undefined && platform.total_posts > 0 && (
                  <span className="text-xs text-wire-muted">
                    {platform.total_posts} posts
                  </span>
                )}
              </div>
              {statusDetails && !statusDetails.is_connected && statusDetails.details && (
                <div className="mt-1 text-xs text-wire-muted">
                  {Object.entries(statusDetails.details).map(([key, value]) => (
                    <span key={key} className="mr-2">
                      {key}: {String(value)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Configure Button */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" title="Configure credentials">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent
                title={`${PLATFORM_LABEL[platform.name] ?? platform.name} credentials`}
                description="API keys/tokens for this platform."
              >
                <div className="space-y-4">
                  {renderConfigFields()}

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={platform.enabled}
                      onCheckedChange={() => toggle(platform.id)}
                    />
                    <Label className="cursor-pointer">
                      {platform.enabled ? "Enabled" : "Disabled"}
                    </Label>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save credentials"
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Toggle Switch */}
            <Switch
              checked={platform.enabled}
              onCheckedChange={() => toggle(platform.id)}
            />
          </div>
        </div>

        {/* Connection Status Details */}
        {statusDetails && statusDetails.is_connected && (
          <div className="mt-3 border-t border-wire-border pt-3">
            <div className="flex items-center gap-2 text-xs text-green-600">
              <CheckCircle className="h-3 w-3" />
              <span>Connected</span>
              {statusDetails.details?.verified_channels !== undefined && (
                <span className="text-wire-muted">
                  • {statusDetails.details.verified_channels} verified channels
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
