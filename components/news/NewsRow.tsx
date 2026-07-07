"use client";

import { useState } from "react";
import Image from "next/image";
import { Send, ExternalLink, Eye } from "lucide-react";
import { News } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { useNewsStore } from "@/store/useNewsStore";
import { NewsDetailModal } from "./NewsDetailModal";

export function NewsRow({ item }: { item: News }) {
  const repost = useNewsStore((s) => s.repost);
  const reposting = useNewsStore((s) => s.reposting[item.id] ?? false);
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <>
      <div className="flex gap-4 border-b border-wire-border py-4 last:border-b-0">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded bg-wire-surface2">
          {item.image ? (
            <Image src={item.image} alt="" fill className="object-cover" unoptimized />
          ) : (
            <div className="flex h-full items-center justify-center text-eyebrow">No image</div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="line-clamp-2 text-sm font-medium text-wire-text hover:text-wire-signal"
            >
              {item.title}
              <ExternalLink className="ml-1 inline h-3 w-3 opacity-50" />
            </a>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setDetailOpen(true)}
                title="View details"
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                loading={reposting}
                onClick={() => repost(item.id)}
                title="Post again to all enabled platforms"
              >
                <Send className="h-3 w-3" />
                Repost
              </Button>
            </div>
          </div>

          <p className="mt-1 line-clamp-1 text-xs text-wire-muted">{item.summary}</p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge tone="muted">{item.category || "uncategorized"}</Badge>
            {item.country && <Badge tone="muted">{item.country}</Badge>}
            <span className="text-eyebrow">{item.source}</span>
            <span className="text-eyebrow">{formatDateTime(item.published)}</span>
            {item.posted_to.length === 0 ? (
              <Badge tone="pending">not posted</Badge>
            ) : (
              item.posted_to.map((p) => (
                <Badge key={p} tone="success">
                  {p}
                </Badge>
              ))
            )}
          </div>
        </div>
      </div>
      <NewsDetailModal
        newsId={item.id}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}
