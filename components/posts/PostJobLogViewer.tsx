"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PostLog } from "@/lib/types";
import { postJobApi } from "@/lib/api/posts";
import { apiErrorMessage } from "@/lib/axios";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

const LOG_ACTION_TONE: Record<string, "success" | "danger" | "pending" | "muted"> = {
  created: "muted",
  processing: "pending",
  success: "success",
  failed: "danger",
  retry: "pending",
  skipped: "muted",
};

interface PostJobLogViewerProps {
  jobId: number;
  open: boolean;
  onClose: () => void;
}

export function PostJobLogViewer({ jobId, open, onClose }: PostJobLogViewerProps) {
  const [logs, setLogs] = useState<PostLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    postJobApi
      .logs(jobId)
      .then(setLogs)
      .catch((err) => toast.error(apiErrorMessage(err, "Failed to load logs")))
      .finally(() => setLoading(false));
  }, [jobId, open]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent title="Post Job Logs" description={`Job #${jobId}`} className="max-w-lg">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-wire-muted" />
          </div>
        ) : logs.length === 0 ? (
          <p className="py-6 text-center text-sm text-wire-muted">No logs for this job.</p>
        ) : (
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded border border-wire-border bg-wire-surface2 p-3 text-xs"
              >
                <div className="mb-1 flex items-center gap-2">
                  <Badge tone={LOG_ACTION_TONE[log.status] ?? "muted"}>
                    {log.action}
                  </Badge>
                  {log.status && (
                    <span className="text-wire-muted">{log.status}</span>
                  )}
                  <span className="ml-auto text-wire-muted">
                    {formatDateTime(log.created_at)}
                  </span>
                </div>
                {log.message && (
                  <p className="text-wire-text">{log.message}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
