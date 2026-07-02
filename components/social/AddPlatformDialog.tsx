// components/social/AddPlatformDialog.tsx

"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, CheckCircle2, XCircle, Eye, EyeOff, Info } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePlatformStore } from "@/store/usePlatformStore";
import { PLATFORM_DISPLAY_NAMES, PLATFORM_CONFIG_FIELDS } from "@/lib/types";
import { toast } from "sonner";

type PlatformType = "twitter" | "facebook" | "instagram";

interface AddPlatformDialogProps {
  onSuccess?: () => void;
}

const PLATFORM_META: Record<
  PlatformType,
  { icon: string; ring: string; solid: string; helpText: string }
> = {
  twitter: {
    icon: "🐦",
    ring: "ring-black dark:ring-white",
    solid: "bg-black",
    helpText: "Get your API keys from the Twitter Developer Portal.",
  },
  facebook: {
    icon: "👍",
    ring: "ring-[#1877F2]",
    solid: "bg-[#1877F2]",
    helpText: "You need a Facebook Page and a Page Access Token.",
  },
  instagram: {
    icon: "📸",
    ring: "ring-[#E4405F]",
    solid: "bg-gradient-to-br from-[#405DE6] via-[#5851DB] to-[#E4405F]",
    helpText: "You need an Instagram Business Account linked to a Facebook Page.",
  },
};

const FIELD_HINTS: Record<string, string> = {
  api_key: "Found in the Twitter Developer Portal, under your app's Keys and Tokens.",
  page_id: "Your Facebook Page ID, found in Page Settings.",
  business_account_id: "Your Instagram Business Account ID.",
};

export function AddPlatformDialog({ onSuccess }: AddPlatformDialogProps) {
  const connect = usePlatformStore((s) => s.connect);
  const testConnection = usePlatformStore((s) => s.testConnection);
  const [open, setOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>("twitter");
  const [config, setConfig] = useState<Record<string, string>>({});
  const [enabled, setEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: Record<string, unknown>;
  } | null>(null);

  const platformOptions: PlatformType[] = ["twitter", "facebook", "instagram"];

  useEffect(() => {
    setConfig({});
    setTestResult(null);
  }, [selectedPlatform]);

  useEffect(() => {
    setTestResult(null);
  }, [config]);

  function handleConfigChange(key: string, value: string) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  function togglePasswordVisibility(key: string) {
    setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function getConfigFields() {
    return PLATFORM_CONFIG_FIELDS[selectedPlatform] || [];
  }

  function isFormValid() {
    const fields = getConfigFields();
    const requiredFields = fields.filter((f) => f.required);
    return requiredFields.every((f) => config[f.key]?.trim());
  }

  async function handleTest() {
    const fields = getConfigFields();
    const requiredFields = fields.filter((f) => f.required);
    const missingFields = requiredFields.filter((f) => !config[f.key]?.trim());

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.map((f) => f.label).join(", ")}`);
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const success = await testConnection({
        platform: selectedPlatform,
        config,
      });

      setTestResult({
        success,
        message: success
          ? "Connection successful. You're ready to save this platform."
          : "Connection failed. Double-check your credentials and try again.",
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: "Connection test failed. Double-check your credentials and try again.",
      });
    } finally {
      setTesting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const fields = getConfigFields();
    const requiredFields = fields.filter((f) => f.required);
    const missingFields = requiredFields.filter((f) => !config[f.key]?.trim());

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.map((f) => f.label).join(", ")}`);
      return;
    }

    setSaving(true);
    try {
      const platform = await connect({
        platform: selectedPlatform,
        enabled,
        config,
      });

      if (platform) {
        resetForm();
        setOpen(false);
        toast.success(`${PLATFORM_DISPLAY_NAMES[selectedPlatform]} connected successfully`);
        if (onSuccess) onSuccess();
      }
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setConfig({});
    setEnabled(true);
    setTestResult(null);
    setShowPasswords({});
  }

  const meta = PLATFORM_META[selectedPlatform];
  const fields = getConfigFields();

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Platform
        </Button>
      </DialogTrigger>

      <DialogContent
        title="Add social platform"
        description="Connect X (Twitter), Facebook, or Instagram to start posting news automatically."
        className="sm:max-w-[600px] p-0 gap-0 max-h-[92vh] flex flex-col overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
          {/* Scrollable body */}
          <div className="overflow-y-auto px-5 sm:px-6 py-5 space-y-6 flex-1">
            {/* Step 1 — Platform selection */}
            <div className="space-y-2.5">
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-semibold text-wire-signal tracking-wide">
                  STEP 1
                </span>
                <Label className="text-sm">Choose a platform</Label>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {platformOptions.map((platform) => {
                  const isSelected = selectedPlatform === platform;
                  return (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => setSelectedPlatform(platform)}
                      aria-pressed={isSelected}
                      className={`relative flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-3.5 sm:py-4 transition-all duration-150 ${
                        isSelected
                          ? "border-wire-signal bg-wire-signal/[0.06] shadow-sm"
                          : "border-wire-border hover:border-wire-signal/40 hover:bg-wire-surface2/50"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 className="absolute top-1.5 right-1.5 h-3.5 w-3.5 text-wire-signal" />
                      )}
                      <span className="text-2xl leading-none">
                        {PLATFORM_META[platform].icon}
                      </span>
                      <span className="text-xs font-medium text-wire-text">
                        {PLATFORM_DISPLAY_NAMES[platform]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2 — Credentials */}
            <div className="space-y-3 rounded-xl border border-wire-border bg-wire-surface2/40 p-4">
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-semibold text-wire-signal tracking-wide">
                  STEP 2
                </span>
                <Label className="text-sm">
                  {PLATFORM_DISPLAY_NAMES[selectedPlatform]} credentials
                </Label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-3.5">
                {fields.map((field) => {
                  const isPassword = field.type === "password";
                  const showPassword = showPasswords[field.key];
                  const value = config[field.key] || "";
                  const hint = FIELD_HINTS[field.key] || field.help;

                  return (
                    <div key={field.key} className="space-y-1">
                      <Label htmlFor={`config-${field.key}`} className="text-xs text-wire-muted">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-0.5">*</span>}
                      </Label>
                      <div className="relative">
                        <Input
                          id={`config-${field.key}`}
                          type={isPassword && !showPassword ? "password" : "text"}
                          value={value}
                          onChange={(e) => handleConfigChange(field.key, e.target.value)}
                          placeholder={field.label}
                          className="pr-9 h-9 text-sm focus-visible:ring-2 focus-visible:ring-wire-signal/50"
                          required={field.required}
                        />
                        {isPassword && value && (
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(field.key)}
                            className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-wire-muted hover:text-wire-text hover:bg-wire-surface2 transition-colors"
                            aria-label={showPassword ? "Hide value" : "Show value"}
                          >
                            {showPassword ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                      {hint && <p className="text-[11px] text-wire-muted leading-snug">{hint}</p>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enable toggle */}
            <button
              type="button"
              onClick={() => setEnabled((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border border-wire-border px-4 py-3 text-left transition-colors hover:bg-wire-surface2/40"
            >
              <div>
                <p className="text-sm font-medium text-wire-text">Enable platform immediately</p>
                <p className="text-[11px] text-wire-muted">
                  Posts will start publishing here as soon as it's connected.
                </p>
              </div>
              <span
                role="switch"
                aria-checked={enabled}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
                  enabled ? "bg-wire-signal" : "bg-wire-border"
                }`}
              >
                <span
                  className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                    enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </span>
            </button>

            {/* Test result */}
            {testResult && (
              <div
                className={`flex items-start gap-2.5 rounded-xl border-l-4 p-3.5 animate-in fade-in slide-in-from-top-1 duration-200 ${
                  testResult.success
                    ? "border-l-green-500 bg-green-50 dark:bg-green-950/20"
                    : "border-l-red-500 bg-red-50 dark:bg-red-950/20"
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                )}
                <div className="space-y-1">
                  <p className="text-sm text-wire-text">{testResult.message}</p>
                  {testResult.details && (
                    <div className="text-[11px] text-wire-muted space-y-0.5">
                      {Object.entries(testResult.details).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium">{key}:</span> {String(value)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Help text */}
            <div className="flex gap-2.5 rounded-xl bg-wire-surface2 p-3.5 border border-wire-border">
              <Info className="h-4 w-4 mt-0.5 text-wire-muted shrink-0" />
              <p className="text-xs text-wire-muted leading-relaxed">
                <span className="font-medium text-wire-text">Need credentials? </span>
                {meta.helpText}
              </p>
            </div>
          </div>

          {/* Sticky action footer */}
          <div className="border-t border-wire-border bg-wire-surface2/30 px-5 sm:px-6 py-4 flex flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={handleTest}
              disabled={testing || !isFormValid()}
            >
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Testing...
                </>
              ) : (
                "Test connection"
              )}
            </Button>
            <Button type="submit" className="flex-1" disabled={saving || !isFormValid()}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect platform"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}