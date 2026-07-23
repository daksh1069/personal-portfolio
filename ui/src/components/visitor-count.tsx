"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

/**
 * Total-visitors badge for the footer. Counts one visit per browsing
 * session (sessionStorage guard) via /api/visitors, which is backed by
 * Upstash Redis. Renders nothing until the Upstash env vars are set,
 * so the site works unchanged without it.
 */
export function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const counted = sessionStorage.getItem("visit-counted");
    fetch("/api/visitors", { method: counted ? "GET" : "POST" })
      .then((r) => r.json())
      .then((d: { enabled: boolean; count?: number }) => {
        if (!d.enabled) return;
        if (!counted) sessionStorage.setItem("visit-counted", "1");
        setCount(d.count ?? null);
      })
      .catch(() => {});
  }, []);

  if (count === null) return null;

  return (
    <span className="flex items-center gap-1.5 font-mono text-xs tabular-nums">
      <Eye className="h-3.5 w-3.5" />
      {count.toLocaleString()} visitors
    </span>
  );
}
