"use client";

import { useState } from "react";
import { Plus, Loader2, CheckCircle2, XCircle, Info } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bufferApi } from "@/lib/api/buffer";
import { toast } from "sonner";

interface AddAccountDialogProps {
  onSuccess?: () => void;
}

export function AddAccountDialog({ onSuccess }: AddAccountDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  function isFormValid() {
    return apiUrl.trim().length > 0 && apiKey.trim().length > 0;
  }

  async function handleTest() {
    if (!isFormValid()) {
      toast.error("Please enter the API URL and API key");
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      await bufferApi.connect({
        api_key: apiKey.trim(),
        api_url: apiUrl.trim(),
        name: name.trim() || undefined,
      });
      setTestResult({
        success: true,
        message: "Connection successful. You're ready to connect.",
      });
    } catch {
      setTestResult({
        success: false,
        message: "Connection failed. Double-check your credentials and try again.",
      });
    }
    setTesting(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Please enter the API URL and API key");
      return;
    }
    setSaving(true);
    try {
      await bufferApi.connect({
        api_key: apiKey.trim(),
        api_url: apiUrl.trim(),
        name: name.trim() || undefined,
      });
      setName("");
      setApiUrl("");
      setApiKey("");
      setTestResult(null);
      setOpen(false);
      toast.success("Account connected successfully");
      if (onSuccess) onSuccess();
    } catch {
      toast.error("Failed to connect account");
    }
    setSaving(false);
  }

  function resetForm() {
    setName("");
    setApiUrl("");
    setApiKey("");
    setTestResult(null);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Account
        </Button>
      </DialogTrigger>

      <DialogContent
        title="Add Buffer Account"
        description="Connect a new Buffer account with its own news source."
        className="sm:max-w-[500px]"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="account-name" className="text-sm text-wire-muted">
              Account Name <span className="text-wire-muted">(optional)</span>
            </Label>
            <Input
              id="account-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. News Bot, Sports Account"
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="api-url" className="text-sm text-wire-muted">
              News API URL <span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              id="api-url"
              type="url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://example.com/api/news/recent/"
              className="h-9 text-sm"
              required
            />
            <p className="text-xs text-wire-muted">
              The upstream API endpoint to fetch news from for this account.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="buffer-api-key" className="text-sm text-wire-muted">
              Buffer API Key <span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              id="buffer-api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your Buffer API key"
              className="h-9 text-sm"
              required
            />
          </div>

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
              <p className="text-sm text-wire-text">{testResult.message}</p>
            </div>
          )}

          <div className="flex gap-2.5 rounded-xl bg-wire-surface2 p-3.5 border border-wire-border">
            <Info className="h-4 w-4 mt-0.5 text-wire-muted shrink-0" />
            <p className="text-xs text-wire-muted leading-relaxed">
              <span className="font-medium text-wire-text">Need a token? </span>
              Visit the{" "}
              <a
                href="https://buffer.com/developers"
                target="_blank"
                rel="noreferrer"
                className="text-wire-signal hover:underline"
              >
                Buffer Developer Portal
              </a>{" "}
              to generate an API key.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
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
                "Connect"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
