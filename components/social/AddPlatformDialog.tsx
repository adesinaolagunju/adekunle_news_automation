"use client";

import { useState } from "react";
import { Plus, Loader2, CheckCircle2, XCircle, Info } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBufferStore } from "@/store/useBufferStore";
import { toast } from "sonner";

interface AddPlatformDialogProps {
  onSuccess?: () => void;
}

export function AddPlatformDialog({ onSuccess }: AddPlatformDialogProps) {
  const connect = useBufferStore((s) => s.connect);
  const testConnection = useBufferStore((s) => s.testConnection);
  const [open, setOpen] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  function isFormValid() {
    return accessToken.trim().length > 0;
  }

  async function handleTest() {
    if (!isFormValid()) {
      toast.error("Please enter your Buffer access token");
      return;
    }
    setTesting(true);
    setTestResult(null);
    const success = await testConnection(accessToken.trim());
    setTestResult({
      success,
      message: success
        ? "Connection successful. You're ready to connect."
        : "Connection failed. Double-check your token and try again.",
    });
    setTesting(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Please enter your Buffer access token");
      return;
    }
    setSaving(true);
    const ok = await connect({ access_token: accessToken.trim() });
    if (ok) {
      setAccessToken("");
      setTestResult(null);
      setOpen(false);
      toast.success("Buffer connected successfully");
      if (onSuccess) onSuccess();
    }
    setSaving(false);
  }

  function resetForm() {
    setAccessToken("");
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
        <Button variant="outline">
          <Plus className="h-3.5 w-3.5 mr-1" />
          Connect Buffer
        </Button>
      </DialogTrigger>

      <DialogContent
        title="Connect Buffer"
        description="Connect your Buffer account to start posting to X, Facebook, and Instagram."
        className="sm:max-w-[500px]"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="buffer-token" className="text-sm text-wire-muted">
              Buffer Access Token <span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              id="buffer-token"
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Paste your Buffer access token"
              className="h-9 text-sm"
              required
            />
            <p className="text-xs text-wire-muted">
              Found in your Buffer developer portal under Account &gt; API.
            </p>
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
              to generate an access token.
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
