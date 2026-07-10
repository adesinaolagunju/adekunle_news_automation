"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategoryStore } from "@/store/useCategoryStore";

export function CategoryManager() {
  const items = useCategoryStore((s) => s.items);
  const loading = useCategoryStore((s) => s.loading);
  const fetchAll = useCategoryStore((s) => s.fetchAll);
  const create = useCategoryStore((s) => s.create);
  const toggle = useCategoryStore((s) => s.toggle);
  const remove = useCategoryStore((s) => s.remove);

  const [name, setName] = useState("");

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await create(name.trim());
    setName("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-wire-muted">
          Only enabled categories are pulled from the news source and eligible for posting.
        </p>

        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            placeholder="e.g. Politics"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="sm">
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </form>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-9" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-wire-muted">No categories yet.</p>
        ) : (
          <div className="divide-y divide-wire-border">
            {items.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2">
                <span className="text-sm text-wire-text">{c.name}</span>
                <div className="flex items-center gap-3">
                  <Switch checked={c.enabled} onCheckedChange={() => toggle(c)} />
                  <Button variant="ghost" size="icon" onClick={() => remove(c.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-wire-danger" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
