"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { volSmileSeries } from "@/lib/mock-series";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { ChartLegend } from "@/components/charts/chart-legend";

export function VolSmileChart() {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <ChartLegend
          items={[
            { label: "Market IV", color: "var(--chart-5)" },
            { label: "SVI model fit", color: "var(--chart-1)" },
          ]}
        />
        <span className="font-mono text-[11px] text-muted-foreground">Implied vol % · simulated</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={volSmileSeries} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="moneyness"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            label={{
              value: "Strike / Spot",
              position: "insideBottom",
              offset: -2,
              fontSize: 11,
              fill: "var(--muted-foreground)",
            }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            width={36}
            tickFormatter={(v: number) => `${v}%`}
          />
          <Tooltip
            content={(props) => <ChartTooltip {...props} formatter={(v) => `${v.toFixed(1)}%`} />}
            cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "2 4" }}
          />
          <Line
            type="monotone"
            dataKey="market"
            name="Market IV"
            stroke="var(--chart-5)"
            strokeWidth={2}
            dot={{ r: 2.5 }}
          />
          <Line
            type="monotone"
            dataKey="model"
            name="SVI model fit"
            stroke="var(--chart-1)"
            strokeWidth={2}
            strokeDasharray="4 3"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
