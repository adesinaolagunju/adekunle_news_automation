"use client";

import { useState } from "react";
import { RotateCcw, Trash2, ScrollText } from "lucide-react";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { PostJob } from "@/lib/types";
import { usePostJobStore } from "@/store/usePostJobStore";
import { formatDateTime } from "@/lib/utils";
import { PostJobLogViewer } from "./PostJobLogViewer";

const STATUS_TONE: Record<string, "success" | "danger" | "pending" | "muted"> = {
  success: "success",
  failed: "danger",
  permanent_fail: "danger",
  pending: "pending",
};

export function PostJobTable({ items }: { items: PostJob[] }) {
  const retry = usePostJobStore((s) => s.retry);
  const retryingId = usePostJobStore((s) => s.retryingId);
  const remove = usePostJobStore((s) => s.remove);
  const removingId = usePostJobStore((s) => s.removingId);
  const [logViewerJobId, setLogViewerJobId] = useState<number | null>(null);

  return (
    <>
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
                <div className="flex items-center gap-1">
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
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setLogViewerJobId(job.id)}
                    title="View logs"
                  >
                    <ScrollText className="h-3.5 w-3.5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" disabled={removingId === job.id}>
                        <Trash2 className="h-3.5 w-3.5 text-wire-danger" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent
                      title="Remove job"
                      description={`Remove this post job for "${job.news_title}"? This can't be undone.`}
                      confirmLabel="Remove"
                      destructive
                      onConfirm={() => remove(job.id)}
                    />
                  </AlertDialog>
                </div>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
      {logViewerJobId !== null && (
        <PostJobLogViewer
          jobId={logViewerJobId}
          open={logViewerJobId !== null}
          onClose={() => setLogViewerJobId(null)}
        />
      )}
    </>
  );
}
