"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { AccountSidebar } from "@/components/layout/AccountSidebar";
import { Header } from "@/components/layout/Header";
import { AuthGuard } from "@/components/layout/AuthGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-wire-bg">
        <Sidebar />
        <AccountSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
