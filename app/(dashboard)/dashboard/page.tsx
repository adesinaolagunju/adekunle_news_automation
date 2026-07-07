"use client";

import { useEffect } from "react";
import {
  Newspaper,
  Send,
  Clock,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  List,
  SendToBack,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStatsStore } from "@/store/useStatsStore";
import { useNewsStore } from "@/store/useNewsStore";

export default function DashboardPage() {
  const dashboard = useStatsStore((s) => s.dashboard);
  const loading = useStatsStore((s) => s.loading);
  const fetchDashboard = useStatsStore((s) => s.fetchDashboard);
  const fetchNow = useNewsStore((s) => s.fetchNow);
  const fetching = useNewsStore((s) => s.fetching);
  const fetchRecent = useNewsStore((s) => s.fetchRecent);
  const fetchingRecent = useNewsStore((s) => s.fetchingRecent);
  const postAll = useNewsStore((s) => s.postAll);
  const postingAll = useNewsStore((s) => s.postingAll);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-wire-text">Dashboard</h1>
          <p className="text-sm text-wire-muted">
            Live status of the automated news wire.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            loading={fetchingRecent}
            onClick={async () => {
              await fetchRecent();
              fetchDashboard();
            }}
          >
            <List className="h-3.5 w-3.5" />
            Fetch recent
          </Button>
          <Button
            variant="secondary"
            loading={postingAll}
            onClick={async () => {
              await postAll();
              fetchDashboard();
            }}
          >
            <SendToBack className="h-3.5 w-3.5" />
            Post all
          </Button>
        </div>
      </div>

      {loading && !dashboard ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Total news" value={dashboard?.total_news ?? 0} icon={Newspaper} />
          <StatCard label="News today" value={dashboard?.news_today ?? 0} icon={Newspaper} />
          <StatCard label="Total posts" value={dashboard?.total_posts ?? 0} icon={Send} />
          <StatCard label="Posts today" value={dashboard?.posts_today ?? 0} icon={Send} />
          <StatCard
            label="Pending"
            value={dashboard?.pending_posts ?? 0}
            icon={Clock}
            tone="pending"
          />
          <StatCard
            label="Failed"
            value={dashboard?.failed_posts ?? 0}
            icon={AlertTriangle}
            tone="danger"
          />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform performance</CardTitle>
            <Badge tone="success">
              <CheckCircle2 className="h-3 w-3" />
              {dashboard?.success_rate ?? 0}% overall
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboard && Object.keys(dashboard.platforms).length === 0 && (
              <p className="text-sm text-wire-muted">No platforms configured yet.</p>
            )}
            {dashboard &&
              Object.entries(dashboard.platforms).map(([name, stats]) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="font-mono text-sm capitalize text-wire-text">{name}</span>
                  <div className="flex items-center gap-4 text-xs text-wire-muted">
                    <span className="text-wire-success">{stats.success} ok</span>
                    <span className="text-wire-pending">{stats.pending} pending</span>
                    <span className="text-wire-danger">{stats.failed} failed</span>
                    <span className="w-12 text-right text-wire-text">
                      {stats.success_rate.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>News by category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dashboard && Object.keys(dashboard.categories).length === 0 && (
              <p className="text-sm text-wire-muted">No categorized news yet.</p>
            )}
            {dashboard &&
              Object.entries(dashboard.categories).map(([name, count]) => (
                <div key={name} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-wire-text">{name}</span>
                  <span className="font-mono text-wire-muted">{count}</span>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
