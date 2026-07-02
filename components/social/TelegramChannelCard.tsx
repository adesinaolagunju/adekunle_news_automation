// components/social/TelegramChannelCard.tsx

"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  Send, 
  RefreshCcw, 
  Trash2, 
  Users, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Settings2,
  ExternalLink
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TelegramChannel } from "@/lib/types";
import { useTelegramStore } from "@/store/useTelegramStore";
import { toast } from "sonner";

const STATUS_CONFIG = {
  connected: {
    tone: "success" as const,
    label: "Connected ✓",
    icon: CheckCircle,
    className: "text-green-600 bg-green-50 dark:bg-green-950/30",
  },
  pending_verification: {
    tone: "warning" as const,
    label: "Pending Verification",
    icon: AlertCircle,
    className: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30",
  },
  disabled: {
    tone: "muted" as const,
    label: "Disabled",
    icon: AlertCircle,
    className: "text-gray-500 bg-gray-50 dark:bg-gray-800/30",
  },
} as const;

interface TelegramChannelCardProps {
  channel: TelegramChannel;
  onVerify?: () => Promise<void>;
  onTestPost?: () => Promise<void>;
  onSyncInfo?: () => Promise<void>;
  isBusy?: boolean;
  isSyncing?: boolean;
}

export function TelegramChannelCard({ 
  channel, 
  onVerify, 
  onTestPost, 
  onSyncInfo,
  isBusy = false,
  isSyncing = false,
}: TelegramChannelCardProps) {
  const busyId = useTelegramStore((s) => s.busyId);
  const syncingId = useTelegramStore((s) => s.syncingId);
  const verify = useTelegramStore((s) => s.verify);
  const testPost = useTelegramStore((s) => s.testPost);
  const syncInfo = useTelegramStore((s) => s.syncInfo);
  const partialUpdate = useTelegramStore((s) => s.partialUpdate);
  const remove = useTelegramStore((s) => s.remove);
  
  const [openEdit, setOpenEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    name: channel.name,
    default_hashtags: channel.default_hashtags || "",
    parse_mode: channel.parse_mode || "HTML",
  });

  const busy = isBusy || busyId === channel.id;
  const syncing = isSyncing || syncingId === channel.id;
  const status = channel.is_verified ? "connected" : channel.enabled ? "pending_verification" : "disabled";
  const statusConfig = STATUS_CONFIG[status];

  const StatusIcon = statusConfig.icon;

  const handleVerify = async () => {
    if (onVerify) {
      await onVerify();
    } else {
      await verify(channel.id);
    }
  };

  const handleTestPost = async () => {
    if (onTestPost) {
      await onTestPost();
    } else {
      await testPost(channel.id);
    }
  };

  const handleSyncInfo = async () => {
    if (onSyncInfo) {
      await onSyncInfo();
    } else {
      await syncInfo(channel.id);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await partialUpdate(channel.id, {
        name: editForm.name,
        default_hashtags: editForm.default_hashtags,
        parse_mode: editForm.parse_mode as "HTML" | "MarkdownV2" | "Markdown",
      });
      setOpenEdit(false);
      toast.success(`Channel "${editForm.name}" updated successfully`);
    } catch (err) {
      // Error handled by store
    }
  };

  const handleToggle = async (checked: boolean) => {
    await partialUpdate(channel.id, { enabled: checked });
  };

  const handleRemove = async () => {
    await remove(channel.id);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className={!channel.enabled ? "opacity-60" : ""}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="font-display text-sm font-semibold text-wire-text truncate">
                {channel.name}
              </div>
              {channel.is_verified && (
                <Badge tone="success" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-wire-muted truncate">
                {channel.channel_username || channel.channel_chat_id}
              </span>
              <Badge tone={statusConfig.tone} className="text-xs flex items-center gap-1">
                <StatusIcon className="h-3 w-3" />
                {statusConfig.label}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-wire-muted">
          {channel.subscriber_count > 0 && (
            <div className="flex items-center gap-1.5">
              <Users className="h-3 w-3" />
              {channel.subscriber_count.toLocaleString()} subscribers
            </div>
          )}
          {channel.is_verified && (
            <div className="flex items-center gap-1.5">
              <span>Parse mode: {channel.parse_mode}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span>Created: {formatDate(channel.created_at)}</span>
          </div>
        </div>

        {/* Hashtags */}
        {channel.default_hashtags && (
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <span className="text-wire-muted">Hashtags:</span>
            {channel.default_hashtags.split(/\s+/).map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-wire-border">
          {!channel.is_verified ? (
            <Button 
              size="sm" 
              variant="secondary" 
              disabled={busy}
              onClick={handleVerify}
            >
              {busy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
              ) : (
                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
              )}
              Verify
            </Button>
          ) : (
            <>
              <Button 
                size="sm" 
                variant="secondary" 
                disabled={busy}
                onClick={handleTestPost}
              >
                {busy ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                ) : (
                  <Send className="h-3.5 w-3.5 mr-1" />
                )}
                Test post
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={syncing}
                onClick={handleSyncInfo}
                title="Sync subscriber count and channel info"
              >
                {syncing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCcw className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(`https://t.me/${channel.channel_username?.replace('@', '')}`, '_blank')}
                title="Open channel in Telegram"
                disabled={!channel.channel_username}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </>
          )}

          {/* Edit Dialog */}
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost" title="Edit channel settings">
                <Settings2 className="h-3.5 w-3.5" />
              </Button>
            </DialogTrigger>
            <DialogContent title="Edit Telegram Channel" description="Update channel settings">
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-name">Display name</Label>
                  <Input
                    id="edit-name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Channel name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-hashtags">Default hashtags</Label>
                  <Input
                    id="edit-hashtags"
                    value={editForm.default_hashtags}
                    onChange={(e) => setEditForm({ ...editForm, default_hashtags: e.target.value })}
                    placeholder="#News #BreakingNews"
                  />
                  <p className="text-xs text-wire-muted">
                    These will be added to every post
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-parse-mode">Parse mode</Label>
                  <select
                    id="edit-parse-mode"
                    value={editForm.parse_mode}
                    onChange={(e) => setEditForm({ ...editForm, parse_mode: e.target.value })}
                    className="w-full rounded border border-wire-border bg-wire-surface2 p-2 text-sm text-wire-text focus-visible:outline-none focus-visible:border-wire-signal/60"
                  >
                    <option value="HTML">HTML</option>
                    <option value="MarkdownV2">MarkdownV2</option>
                    <option value="Markdown">Markdown</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setOpenEdit(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Save changes
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <div className="ml-auto flex items-center gap-2">
            <Switch
              checked={channel.enabled}
              onCheckedChange={handleToggle}
              disabled={busy}
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" disabled={busy}>
                  <Trash2 className="h-3.5 w-3.5 text-wire-danger" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent
                title="Remove channel"
                description={`This stops all future posts to "${channel.name}". This can't be undone.`}
                confirmLabel="Remove"
                confirmVariant="destructive"
                onConfirm={handleRemove}
              />
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}