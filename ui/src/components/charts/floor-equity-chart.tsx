"use client";

import { useMemo } from "react";
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
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { ChartLegend } from "@/components/charts/chart-legend";
import floorEngine from "@/data/generated/floor-engine.json";

function monthLabel(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

/**
 * Real daily equity curves from the floor engine's published results
 * (results/floor_engine/equity_*.csv + the naked-short benchmark series).
 */
export function FloorEquityChart({ variant = "full" }: { variant?: "compact" | "full" }) {
  const data = useMemo(() => {
    const { dates, equity } = floorEngine;
    return dates.map((d, i) => ({
      date: monthLabel(d),
      collarFrictionless: equity.collarFrictionless[i],
      collarBorrow: equity.collarBorrow[i],
      callBorrow: equity.callBorrow[i],
      nakedShort: equity.nakedShort[i],
    }));
  }, []);

  const series =
    variant === "compact"
      ? [
          { key: "collarFrictionless", name: "Floor engine (collar)", color: "var(--chart-1)" },
          { key: "nakedShort", name: "Naked short TSLL", color: "var(--chart-5)" },
        ]
      : [
          { key: "collarFrictionless", name: "Collar, frictionless", color: "var(--chart-1)" },
          { key: "collarBorrow", name: "Collar, with borrow", color: "var(--chart-4)" },
          { key: "callBorrow", name: "Call-only, with borrow", color: "var(--chart-3)" },
          { key: "nakedShort", name: "Naked short TSLL", color: "var(--chart-5)" },
        ];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <ChartLegend items={series.map((s) => ({ label: s.name, color: s.color }))} />
        <span className="font-mono text-[11px] text-muted-foreground">
          Indexed to 100 · real backtest output
        </span>
      </div>
      <ResponsiveContainer width="100%" height={variant === "compact" ? 280 : 320}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            interval={Math.floor(data.length / 7)}
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
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={s.key === "nakedShort" ? 1.5 : 2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
