// components/social/AddTelegramChannelDialog.tsx

"use client";

import { useState, useEffect } from "react";
import { Plus, FlaskConical, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTelegramStore } from "@/store/useTelegramStore";
import { toast } from "sonner";

const EMPTY = {
  name: "",
  channel_username: "",
  channel_chat_id: "",
  bot_token: "",
  default_hashtags: "#News #BreakingNews",
  parse_mode: "HTML" as const,
};

interface TestResult {
  success: boolean;
  message?: string;
  error?: string;
  bot_info?: {
    id: number;
    is_bot: boolean;
    first_name: string;
    username: string;
  };
  chat_info?: {
    id: number;
    title: string;
    username: string;
    type: string;
    member_count?: number;
  };
}

export function AddTelegramChannelDialog() {
  const create = useTelegramStore((s) => s.create);
  const testConnection = useTelegramStore((s) => s.testConnection);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  // Reset test result when form changes
  useEffect(() => {
    setTestResult(null);
  }, [form.bot_token, form.channel_chat_id, form.channel_username]);

  function update<K extends keyof typeof EMPTY>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function resetForm() {
    setForm(EMPTY);
    setTestResult(null);
  }

  async function handleTest() {
    if (!form.bot_token) {
      toast.error("Enter a bot token first");
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const result = await testConnection({
        bot_token: form.bot_token,
        channel_chat_id: form.channel_chat_id || undefined,
        channel_username: form.channel_username || undefined,
      });

      // Since testConnection returns boolean, we need to check the result
      // The actual test result is stored in the store state
      // We'll construct a result object based on the response
      
      // Actually, let's call the API directly for better control of the result
      const { telegramApi } = await import("@/lib/api/telegram");
      const res = await telegramApi.test({
        bot_token: form.bot_token,
        channel_chat_id: form.channel_chat_id || undefined,
        channel_username: form.channel_username || undefined,
      });

      setTestResult(res);

      if (res.success) {
        toast.success(res.message || "Connection looks good!");
        // Auto-fill channel username if not provided
        if (!form.channel_username && res.chat_info?.username) {
          setForm((f) => ({
            ...f,
            channel_username: `@${res.chat_info?.username}`,
          }));
        }
        // Auto-fill channel chat ID if not provided
        if (!form.channel_chat_id && res.chat_info?.id) {
          setForm((f) => ({
            ...f,
            channel_chat_id: String(res.chat_info?.id),
          }));
        }
      } else {
        toast.error(res.error || "Connection test failed");
      }
    } catch (err) {
      toast.error("Connection test failed");
    } finally {
      setTesting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate required fields
    if (!form.name.trim()) {
      toast.error("Display name is required");
      return;
    }
    if (!form.bot_token.trim()) {
      toast.error("Bot token is required");
      return;
    }

    setSaving(true);
    try {
      const created = await create(form);
      if (created) {
        resetForm();
        setOpen(false);
        toast.success(`Channel "${created.name}" added successfully!`);
      }
    } finally {
      setSaving(false);
    }
  }

  const isFormValid = () => {
    return form.name.trim() && form.bot_token.trim();
  };

  const getTestStatusBadge = () => {
    if (!testResult) return null;
    
    if (testResult.success) {
      return (
        <Badge tone="success" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Connected
        </Badge>
      );
    }
    
    return (
      <Badge tone="error" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Failed
      </Badge>
    );
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Telegram channel
        </Button>
      </DialogTrigger>
      <DialogContent
        title="Add Telegram channel"
        description="Create a bot via @BotFather, add it as admin of your channel, then paste the details below."
        className="sm:max-w-[550px]"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Display name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Ubuntu News Channel"
              className="focus-visible:ring-2 focus-visible:ring-wire-signal/50"
            />
            <p className="text-xs text-wire-muted">
              A friendly name to identify this channel in the dashboard
            </p>
          </div>

          {/* Channel Username & Chat ID */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="channel_username">Channel username</Label>
              <Input
                id="channel_username"
                value={form.channel_username}
                onChange={(e) => update("channel_username", e.target.value)}
                placeholder="@UbuntuNews"
              />
              <p className="text-xs text-wire-muted">Optional, can be auto-detected</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="channel_chat_id">Channel chat ID</Label>
              <Input
                id="channel_chat_id"
                value={form.channel_chat_id}
                onChange={(e) => update("channel_chat_id", e.target.value)}
                placeholder="-1001234567890"
              />
              <p className="text-xs text-wire-muted">Optional, can be auto-detected</p>
            </div>
          </div>

          {/* Bot Token */}
          <div className="space-y-1.5">
            <Label htmlFor="bot_token">
              Bot token <span className="text-red-500">*</span>
            </Label>
            <Input
              id="bot_token"
              required
              type="password"
              value={form.bot_token}
              onChange={(e) => update("bot_token", e.target.value)}
              placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
              className="font-mono"
            />
            <p className="text-xs text-wire-muted">
              Get this from @BotFather on Telegram
            </p>
          </div>

          {/* Hashtags & Parse Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="default_hashtags">Default hashtags</Label>
              <Input
                id="default_hashtags"
                value={form.default_hashtags}
                onChange={(e) => update("default_hashtags", e.target.value)}
                placeholder="#News #BreakingNews"
              />
              <p className="text-xs text-wire-muted">
                These will be added to every post
              </p>
            </div>
            <div className="space-y-1.5">
              <Label>Parse mode</Label>
              <Select
                value={form.parse_mode}
                onValueChange={(v: "HTML" | "MarkdownV2") => update("parse_mode", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HTML">HTML</SelectItem>
                  <SelectItem value="MarkdownV2">MarkdownV2</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-wire-muted">
                Formatting mode for your posts
              </p>
            </div>
          </div>

          {/* Test Result Display */}
          {testResult && (
            <div className={`p-3 rounded-lg border ${
              testResult.success 
                ? 'border-green-200 bg-green-50 dark:bg-green-950/20' 
                : 'border-red-200 bg-red-50 dark:bg-red-950/20'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTestStatusBadge()}
                  <span className="text-sm">
                    {testResult.success 
                      ? testResult.message || 'Connection successful' 
                      : testResult.error || 'Connection failed'}
                  </span>
                </div>
              </div>
              
              {/* Bot Info */}
              {testResult.success && testResult.bot_info && (
                <div className="mt-2 text-xs text-wire-muted space-y-1">
                  <p>
                    <span className="font-medium">Bot:</span> {testResult.bot_info.first_name} 
                    {testResult.bot_info.username && ` (@${testResult.bot_info.username})`}
                  </p>
                  {testResult.chat_info && (
                    <>
                      <p>
                        <span className="font-medium">Channel:</span> {testResult.chat_info.title}
                        {testResult.chat_info.username && ` (@${testResult.chat_info.username})`}
                      </p>
                      {testResult.chat_info.member_count !== undefined && (
                        <p>
                          <span className="font-medium">Members:</span> {testResult.chat_info.member_count}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={handleTest}
              disabled={testing || !form.bot_token}
            >
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <FlaskConical className="h-3.5 w-3.5 mr-2" />
                  Test connection
                </>
              )}
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={saving || !isFormValid()}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save channel'
              )}
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-wire-muted text-center">
            Need help? Learn how to{" "}
            <a 
              href="https://core.telegram.org/bots#6-botfather" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-wire-signal hover:underline"
            >
              create a bot
            </a>{" "}
            and{" "}
            <a 
              href="https://core.telegram.org/bots#4-how-can-i-add-a-bot-to-a-channel" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-wire-signal hover:underline"
            >
              add it to your channel
            </a>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}