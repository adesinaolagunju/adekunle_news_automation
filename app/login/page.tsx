"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
import { authApi } from "@/lib/api/auth";
import { apiErrorMessage } from "@/lib/axios";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasHydrated && isAuthenticated) router.replace("/dashboard");
  }, [hasHydrated, isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(username, password);
      setSession(res);
      toast.success(`Welcome back, ${res.user.username}`);
      router.replace("/dashboard");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Invalid credentials"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-wire-bg px-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0px, transparent 1px, transparent 2px, #fff 3px)",
        }}
      />
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2">
          <Radio className="h-5 w-5 text-wire-signal" />
          <div>
            <div className="font-display text-lg font-semibold leading-none text-wire-text">
              Wire Room
            </div>
            <div className="text-eyebrow mt-1">News Automation Console</div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-md border border-wire-border bg-wire-surface p-6 shadow-2xl"
        >
          <div className="text-eyebrow mb-4 flex items-center gap-2">
            <span className="status-dot bg-wire-signal animate-pulse-dot" />
            Operator sign-in
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="mt-6 w-full" loading={loading}>
            Enter console
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-wire-muted">
          Admin credentials from the Django backend.
        </p>
      </div>
    </div>
  );
}
