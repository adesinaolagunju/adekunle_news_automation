"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function SettingsPage() {
  const settings = useSettingsStore((s) => s.settings);
  const loading = useSettingsStore((s) => s.loading);
  const saving = useSettingsStore((s) => s.saving);
  const fetch = useSettingsStore((s) => s.fetch);
  const save = useSettingsStore((s) => s.save);

  const [form, setForm] = useState({
    posting_interval: 60,
    max_posts_per_run: 10,
    auto_post_enabled: true,
    default_hashtags: "",
    post_template: "",
  });

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  if (loading && !settings) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-wire-text">Settings</h1>
        <p className="text-sm text-wire-muted">
          Controls the hourly Celery beat schedule that fetches and posts news.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm normal-case tracking-normal text-wire-text">
                Auto-posting enabled
              </Label>
              <p className="text-xs text-wire-muted">
                Turn off to pause the hourly job without losing your schedule.
              </p>
            </div>
            <Switch
              checked={form.auto_post_enabled}
              onCheckedChange={(v) => setForm((f) => ({ ...f, auto_post_enabled: v }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="interval">Posting interval (minutes)</Label>
              <Input
                id="interval"
                type="number"
                min={5}
                max={1440}
                value={form.posting_interval}
                onChange={(e) =>
                  setForm((f) => ({ ...f, posting_interval: Number(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="max_posts">Max posts per run</Label>
              <Input
                id="max_posts"
                type="number"
                min={1}
                max={50}
                value={form.max_posts_per_run}
                onChange={(e) =>
                  setForm((f) => ({ ...f, max_posts_per_run: Number(e.target.value) }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Post formatting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="hashtags">Default hashtags</Label>
            <Input
              id="hashtags"
              value={form.default_hashtags}
              onChange={(e) => setForm((f) => ({ ...f, default_hashtags: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="template">Post template</Label>
            <textarea
              id="template"
              rows={8}
              value={form.post_template}
              onChange={(e) => setForm((f) => ({ ...f, post_template: e.target.value }))}
              className="w-full rounded border border-wire-border bg-wire-surface2 p-2 font-mono text-xs text-wire-text focus-visible:outline-none focus-visible:border-wire-signal/60"
            />
            <p className="text-xs text-wire-muted">
              Available placeholders: {"{title} {summary} {link} {hashtags}"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Button loading={saving} onClick={() => save(form)}>
        Save settings
      </Button>
    </div>
  );
}
