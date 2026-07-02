import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  suffix,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "default" | "success" | "danger" | "pending";
  suffix?: string;
}) {
  const toneColor = {
    default: "text-wire-signal",
    success: "text-wire-success",
    danger: "text-wire-danger",
    pending: "text-wire-pending",
  }[tone];

  return (
    <div className="rounded-md border border-wire-border bg-wire-surface p-4">
      <div className="flex items-center justify-between">
        <span className="text-eyebrow">{label}</span>
        <Icon className={cn("h-4 w-4", toneColor)} />
      </div>
      <div className="mt-2 font-display text-2xl font-semibold text-wire-text">
        {value}
        {suffix && <span className="ml-1 text-sm text-wire-muted">{suffix}</span>}
      </div>
    </div>
  );
}
