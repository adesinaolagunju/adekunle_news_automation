import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "default" | "success" | "danger" | "pending" | "muted";

const toneClasses: Record<BadgeTone, string> = {
  default: "bg-wire-signal/10 text-wire-signal border-wire-signal/30",
  success: "bg-wire-success/10 text-wire-success border-wire-success/30",
  danger: "bg-wire-danger/10 text-wire-danger border-wire-danger/30",
  pending: "bg-wire-pending/10 text-wire-pending border-wire-pending/30",
  muted: "bg-wire-surface2 text-wire-muted border-wire-border",
};

export function Badge({
  tone = "default",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
