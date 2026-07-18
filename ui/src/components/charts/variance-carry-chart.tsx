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
import { varianceCarryEquitySeries } from "@/lib/mock-series";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { ChartLegend } from "@/components/charts/chart-legend";

export function VarianceCarryChart() {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <ChartLegend items={[{ label: "Short-variance carry (net of costs)", color: "var(--chart-1)" }]} />
        <span className="font-mono text-[11px] text-muted-foreground">Indexed to 100 · simulated</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={varianceCarryEquitySeries} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
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
            width={40}
          />
          <ReferenceLine y={100} stroke="var(--muted-foreground)" strokeDasharray="2 4" />
          <Tooltip
            content={(props) => <ChartTooltip {...props} formatter={(v) => v.toFixed(1)} />}
            cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "2 4" }}
          />
          <Line
            type="monotone"
            dataKey="equity"
            name="Short-variance carry"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
