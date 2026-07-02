"use client";

import { RotateCcw } from "lucide-react";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PostJob } from "@/lib/types";
import { usePostJobStore } from "@/store/usePostJobStore";
import { formatDateTime } from "@/lib/utils";

const STATUS_TONE: Record<string, "success" | "danger" | "pending" | "muted"> = {
  success: "success",
  failed: "danger",
  permanent_fail: "danger",
  pending: "pending",
};

export function PostJobTable({ items }: { items: PostJob[] }) {
  const retry = usePostJobStore((s) => s.retry);
  const retryingId = usePostJobStore((s) => s.retryingId);

  return (
    <Table>
      <THead>
        <TR>
          <TH>News</TH>
          <TH>Platform</TH>
          <TH>Status</TH>
          <TH>Posted</TH>
          <TH>Retries</TH>
          <TH></TH>
        </TR>
      </THead>
      <TBody>
        {items.map((job) => (
          <TR key={job.id}>
            <TD className="max-w-xs truncate" title={job.news_title}>
              {job.news_title}
            </TD>
            <TD className="capitalize">
              {job.platform_name}
              {job.channel_name && (
                <span className="ml-1 text-xs text-wire-muted">· {job.channel_name}</span>
              )}
            </TD>
            <TD>
              <Badge tone={STATUS_TONE[job.status] ?? "muted"}>{job.status}</Badge>
            </TD>
            <TD className="font-mono text-xs text-wire-muted">
              {job.posted_at ? formatDateTime(job.posted_at) : job.time_ago}
            </TD>
            <TD className="font-mono text-xs text-wire-muted">
              {job.retry_count}/{job.max_retries}
            </TD>
            <TD>
              {(job.status === "failed" || job.status === "permanent_fail") && (
                <Button
                  size="sm"
                  variant="secondary"
                  loading={retryingId === job.id}
                  onClick={() => retry(job.id)}
                >
                  <RotateCcw className="h-3 w-3" />
                  Retry
                </Button>
              )}
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
