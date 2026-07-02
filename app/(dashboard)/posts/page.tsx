"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostJobTable } from "@/components/posts/PostJobTable";
import { usePostJobStore } from "@/store/usePostJobStore";

export default function PostsPage() {
  const items = usePostJobStore((s) => s.items);
  const loading = usePostJobStore((s) => s.loading);
  const count = usePostJobStore((s) => s.count);
  const page = usePostJobStore((s) => s.page);
  const setPage = usePostJobStore((s) => s.setPage);
  const setFilters = usePostJobStore((s) => s.setFilters);
  const fetchList = usePostJobStore((s) => s.fetchList);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-wire-text">Post History</h1>
        <p className="text-sm text-wire-muted">
          Every attempt to publish a news item, across every platform.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select onValueChange={(v) => setFilters({ status: v === "all" ? undefined : v })}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="permanent_fail">Permanent fail</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(v) => setFilters({ platform: v === "all" ? undefined : v })}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All platforms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All platforms</SelectItem>
            <SelectItem value="telegram">Telegram</SelectItem>
            <SelectItem value="x">X</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent>
          {loading && items.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-9" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-sm text-wire-muted">No post jobs match these filters.</p>
          ) : (
            <>
              <PostJobTable items={items} />
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
