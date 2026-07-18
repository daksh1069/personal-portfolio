"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { hedgingPnlLeakage } from "@/lib/mock-series";
import { ChartTooltip } from "@/components/charts/chart-tooltip";

export function PnlLeakageChart() {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Delta-hedging P&amp;L leakage, indexed to Black-Scholes = 100</span>
        <span className="font-mono text-[11px] text-muted-foreground">Lower is better · simulated</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={hedgingPnlLeakage} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 110]}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="model"
            width={170}
            tick={{ fontSize: 12, fill: "var(--foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={(props) => <ChartTooltip {...props} formatter={(v) => v.toFixed(0)} />}
            cursor={{ fill: "var(--muted)" }}
          />
          <Bar dataKey="leakage" name="P&L leakage" fill="var(--chart-1)" radius={[0, 4, 4, 0]} barSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
