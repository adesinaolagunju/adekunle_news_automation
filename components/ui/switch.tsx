"use client";
import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-wire-border bg-wire-surface2 transition-colors data-[state=checked]:bg-wire-signal data-[state=checked]:border-wire-signal disabled:opacity-50",
      className
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb className="pointer-events-none block h-3.5 w-3.5 translate-x-0.5 rounded-full bg-wire-text shadow transition-transform data-[state=checked]:translate-x-4 data-[state=checked]:bg-black" />
  </SwitchPrimitives.Root>
));
Switch.displayName = "Switch";
