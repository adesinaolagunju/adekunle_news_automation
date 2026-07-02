"use client";
import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

export function AlertDialogContent({
  title,
  description,
  onConfirm,
  confirmLabel = "Confirm",
  destructive = true,
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  confirmLabel?: string;
  destructive?: boolean;
}) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
      <AlertDialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-md border border-wire-border bg-wire-surface p-5 shadow-2xl">
        <AlertDialogPrimitive.Title className="font-display text-base font-semibold text-wire-text">
          {title}
        </AlertDialogPrimitive.Title>
        <AlertDialogPrimitive.Description className="mt-2 text-sm text-wire-muted">
          {description}
        </AlertDialogPrimitive.Description>
        <div className="mt-5 flex justify-end gap-2">
          <AlertDialogPrimitive.Cancel
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
          >
            Cancel
          </AlertDialogPrimitive.Cancel>
          <AlertDialogPrimitive.Action
            onClick={onConfirm}
            className={cn(
              buttonVariants({ variant: destructive ? "destructive" : "default", size: "sm" })
            )}
          >
            {confirmLabel}
          </AlertDialogPrimitive.Action>
        </div>
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  );
}
