"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function RootPage() {
  const router = useRouter();
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  useEffect(() => {
    if (!hasHydrated) return;
    router.replace(isAuthenticated ? "/dashboard" : "/login");
  }, [hasHydrated, isAuthenticated, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-wire-bg">
      <div className="status-dot animate-pulse-dot bg-wire-signal" />
    </div>
  );
}
