"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { NewsFilters } from "@/components/news/NewsFilters";
import { NewsRow } from "@/components/news/NewsRow";
import { useNewsStore } from "@/store/useNewsStore";
import { useAccountStore } from "@/store/useAccountStore";

export default function NewsPage() {
  const items = useNewsStore((s) => s.items);
  const loading = useNewsStore((s) => s.loading);
  const count = useNewsStore((s) => s.count);
  const page = useNewsStore((s) => s.page);
  const setPage = useNewsStore((s) => s.setPage);
  const fetchList = useNewsStore((s) => s.fetchList);
  const setFilters = useNewsStore((s) => s.setFilters);
  const selectedAccountId = useAccountStore((s) => s.selectedAccountId);
  const accounts = useAccountStore((s) => s.accounts);

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

  useEffect(() => {
    setFilters({ buffer_account: selectedAccountId ?? undefined });
  }, [selectedAccountId, setFilters]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-wire-text">News Feed</h1>
        <p className="text-sm text-wire-muted">
          {selectedAccount
            ? `News for ${selectedAccount.name || `Account ${selectedAccount.id}`}`
            : "All news across all accounts"}
        </p>
      </div>

      <NewsFilters />

      <Card>
        <CardContent>
          {loading && items.length === 0 ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-sm text-wire-muted">
              No news matches these filters yet.
            </p>
          ) : (
            <>
              <div>
                {items.map((item) => (
                  <NewsRow key={item.id} item={item} />
                ))}
              </div>
              <div className="mt-4">
                <Pagination page={page} count={count} onPageChange={setPage} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
