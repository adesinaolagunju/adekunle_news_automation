"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, ExternalLink } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { NewsDetail } from "@/lib/types";
import { newsApi } from "@/lib/api/news";
import { apiErrorMessage } from "@/lib/axios";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

const POST_JOB_STATUS_TONE: Record<string, "success" | "danger" | "pending" | "muted"> = {
  success: "success",
  failed: "danger",
  permanent_fail: "danger",
  pending: "pending",
};

interface NewsDetailModalProps {
  newsId: number;
  open: boolean;
  onClose: () => void;
}

export function NewsDetailModal({ newsId, open, onClose }: NewsDetailModalProps) {
  const [detail, setDetail] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    newsApi
      .get(newsId)
      .then(setDetail)
      .catch((err) => toast.error(apiErrorMessage(err, "Failed to load news details")))
      .finally(() => setLoading(false));
  }, [newsId, open]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent title="News Details" className="max-w-2xl">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-wire-muted" />
          </div>
        ) : !detail ? (
          <p className="py-6 text-center text-sm text-wire-muted">Failed to load details.</p>
        ) : (
          <div className="space-y-4">
            {detail.image && (
              <div className="relative h-48 w-full overflow-hidden rounded bg-wire-surface2">
                <Image src={detail.image} alt="" fill className="object-cover" unoptimized />
              </div>
            )}

            <div>
              <a
                href={detail.link}
                target="_blank"
                rel="noreferrer"
                className="font-display text-base font-semibold text-wire-text hover:text-wire-signal"
              >
                {detail.title}
                <ExternalLink className="ml-1 inline h-3 w-3 opacity-50" />
              </a>
              <p className="mt-1 text-sm text-wire-muted">{detail.summary}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge tone="muted">{detail.category || "uncategorized"}</Badge>
              {detail.country && <Badge tone="muted">{detail.country}</Badge>}
              <span className="text-wire-muted">{detail.source}</span>
              <span className="text-wire-muted">{formatDateTime(detail.published)}</span>
              {detail.posted_to.length === 0 ? (
                <Badge tone="pending">not posted</Badge>
              ) : (
                detail.posted_to.map((p) => (
                  <Badge key={p} tone="success">{p}</Badge>
                ))
              )}
            </div>

            {detail.post_jobs.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-wire-text">
                  Post Jobs ({detail.post_jobs.length})
                </h4>
                <Table>
                  <THead>
                    <TR>
                      <TH>Platform</TH>
                      <TH>Status</TH>
                      <TH>Posted</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {detail.post_jobs.map((job) => (
                      <TR key={job.id}>
                        <TD className="capitalize">{job.platform_name}</TD>
                        <TD>
                          <Badge tone={POST_JOB_STATUS_TONE[job.status] ?? "muted"}>
                            {job.status}
                          </Badge>
                        </TD>
                        <TD className="font-mono text-xs text-wire-muted">
                          {job.posted_at ? formatDateTime(job.posted_at) : job.time_ago}
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
