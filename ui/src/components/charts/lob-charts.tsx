"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { ChartLegend } from "@/components/charts/chart-legend";
import lob from "@/data/generated/lob.json";

/** AAPL mid-price through the session, reconstructed from the engine's
 * top-of-book output (regular trading hours, thinned for display). */
export function LobMidChart({ compact = false }: { compact?: boolean }) {
  const data = useMemo(
    () =>
      lob.mid.t.map((t, i) => ({
        t,
        mid: lob.mid.mid[i],
        spread: lob.mid.spread[i],
      })),
    [],
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <ChartLegend items={[{ label: `${lob.meta.symbol} mid price`, color: "var(--chart-1)" }]} />
        <span className="font-mono text-[11px] text-muted-foreground">
          {lob.meta.date} · reconstructed from engine output
        </span>
      </div>
      <ResponsiveContainer width="100%" height={compact ? 260 : 280}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="t"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            interval={Math.floor(data.length / 7)}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            width={52}
            domain={["auto", "auto"]}
            tickFormatter={(v: number) => `$${v.toFixed(0)}`}
          />
          <Tooltip
            content={(props) => <ChartTooltip {...props} formatter={(v) => `$${v.toFixed(2)}`} />}
            cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "2 4" }}
          />
          <Line type="monotone" dataKey="mid" name="Mid" stroke="var(--chart-1)" strokeWidth={1.8} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Book-update latency distribution from the C++ benchmark (nanoseconds). */
export function LobLatencyChart() {
  const data = lob.latencyHist;
  const { p50, p99, p999 } = lob.latency;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <ChartLegend items={[{ label: "Book updates per latency bin", color: "var(--chart-1)" }]} />
        <span className="font-mono text-[11px] text-muted-foreground">
          p50 {p50}ns · p99 {p99}ns · p99.9 {p999}ns
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -4, bottom: 14 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="bin"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            label={{
              value: "Latency (ns)",
              position: "insideBottom",
              offset: -8,
              fontSize: 11,
              fill: "var(--muted-foreground)",
            }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            width={52}
            tickFormatter={(v: number) => (v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : `${(v / 1e3).toFixed(0)}k`)}
          />
          <Tooltip
            content={(props) => <ChartTooltip {...props} formatter={(v) => v.toLocaleString()} />}
            cursor={{ fill: "var(--muted)" }}
          />
          <Bar dataKey="count" name="Updates" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Per-minute message intensity across regular trading hours. */
export function LobMsgRateChart() {
  const data = lob.perMinute;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <ChartLegend items={[{ label: "Messages per minute", color: "var(--chart-4)" }]} />
        <span className="font-mono text-[11px] text-muted-foreground">
          Open/close auctions dominate · real session data
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -4, bottom: 0 }}>
          <defs>
            <linearGradient id="msgFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-4)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--chart-4)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="t"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            interval={Math.floor(data.length / 7)}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            width={52}
            tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
          />
          <Tooltip
            content={(props) => <ChartTooltip {...props} formatter={(v) => v.toLocaleString()} />}
            cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "2 4" }}
          />
          <Area
            type="monotone"
            dataKey="msgs"
            name="Messages"
            stroke="var(--chart-4)"
            strokeWidth={1.5}
            fill="url(#msgFill)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
