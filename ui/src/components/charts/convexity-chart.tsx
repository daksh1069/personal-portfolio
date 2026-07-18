"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { convexityProtectionSeries } from "@/lib/mock-series";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { ChartLegend } from "@/components/charts/chart-legend";

export function ConvexityChart() {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <ChartLegend
          items={[
            { label: "10% OTM hedge", color: "var(--chart-1)" },
            { label: "Naked short", color: "var(--chart-5)" },
          ]}
        />
        <span className="font-mono text-[11px] text-muted-foreground">Indexed to 100 · simulated</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={convexityProtectionSeries} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            interval={7}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <ReferenceLine y={100} stroke="var(--muted-foreground)" strokeDasharray="2 4" />
          <Tooltip
            content={(props) => <ChartTooltip {...props} formatter={(v) => v.toFixed(1)} />}
            cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "2 4" }}
          />
          <Line
            type="monotone"
            dataKey="hedged10pctOtm"
            name="10% OTM hedge"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="nakedShort"
            name="Naked short"
            stroke="var(--chart-5)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
