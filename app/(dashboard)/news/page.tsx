"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { NewsFilters } from "@/components/news/NewsFilters";
import { NewsRow } from "@/components/news/NewsRow";
import { useNewsStore } from "@/store/useNewsStore";

export default function NewsPage() {
  const items = useNewsStore((s) => s.items);
  const loading = useNewsStore((s) => s.loading);
  const count = useNewsStore((s) => s.count);
  const page = useNewsStore((s) => s.page);
  const setPage = useNewsStore((s) => s.setPage);
  const fetchList = useNewsStore((s) => s.fetchList);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-wire-text">News Feed</h1>
        <p className="text-sm text-wire-muted">
          Articles pulled from the source API, with posting status per platform.
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
