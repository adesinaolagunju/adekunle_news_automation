"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterRuleStore } from "@/store/useFilterRuleStore";

const RULE_TYPES = ["keyword", "category", "country", "source"];
const RULE_ACTIONS = ["include", "exclude"];

export function FilterRuleManager() {
  const items = useFilterRuleStore((s) => s.items);
  const loading = useFilterRuleStore((s) => s.loading);
  const fetchAll = useFilterRuleStore((s) => s.fetchAll);
  const create = useFilterRuleStore((s) => s.create);
  const toggle = useFilterRuleStore((s) => s.toggle);
  const remove = useFilterRuleStore((s) => s.remove);

  const [ruleType, setRuleType] = useState("keyword");
  const [ruleAction, setRuleAction] = useState("exclude");
  const [value, setValue] = useState("");

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    await create({ rule_type: ruleType, rule_action: ruleAction, value: value.trim() });
    setValue("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter rules</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-wire-muted">
          Rules run against every incoming article. An <b>exclude</b> match drops the
          article; an <b>include</b> rule limits posting to matches only.
        </p>

        <form onSubmit={handleAdd} className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Select value={ruleType} onValueChange={setRuleType}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RULE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={ruleAction} onValueChange={setRuleAction}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RULE_ACTIONS.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Value, e.g. crypto"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 min-w-0 sm:min-w-[10rem]"
          />

          <Button type="submit" size="sm">
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add rule</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </form>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-9" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-wire-muted">No filter rules yet — all news is eligible.</p>
        ) : (
          <div className="divide-y divide-wire-border">
            {items.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Badge tone={r.rule_action === "exclude" ? "danger" : "success"}>
                    {r.rule_action}
                  </Badge>
                  <span className="text-sm text-wire-text truncate">
                    {r.rule_type}: <span className="text-wire-muted">{r.value}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Switch checked={r.enabled} onCheckedChange={() => toggle(r)} />
                  <Button variant="ghost" size="icon" onClick={() => remove(r.id)}>
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
