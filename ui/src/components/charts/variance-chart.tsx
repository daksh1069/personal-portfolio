"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { varianceTrackingSeries } from "@/lib/mock-series";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { ChartLegend } from "@/components/charts/chart-legend";

export function VarianceChart() {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <ChartLegend
          items={[
            { label: "Live VIX", color: "var(--chart-5)" },
            { label: "Replicated variance swap", color: "var(--chart-1)" },
          ]}
        />
        <span className="font-mono text-[11px] text-muted-foreground">Vol points · simulated</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={varianceTrackingSeries} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="vixFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-5)" stopOpacity={0.18} />
              <stop offset="95%" stopColor="var(--chart-5)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            interval={11}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            content={(props) => <ChartTooltip {...props} formatter={(v) => `${v.toFixed(1)}`} />}
            cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "2 4" }}
          />
          <Area
            type="monotone"
            dataKey="vix"
            name="Live VIX"
            stroke="var(--chart-5)"
            strokeWidth={1.5}
            fill="url(#vixFill)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="replicated"
            name="Replicated variance swap"
            stroke="var(--chart-1)"
            strokeWidth={2}
            fill="none"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
