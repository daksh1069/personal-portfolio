"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Slider } from "@/components/ui/slider";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { ChartLegend } from "@/components/charts/chart-legend";
import floorEngine from "@/data/generated/floor-engine.json";

const DIAL = floorEngine.riskDial;

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/40 px-3 py-3">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono text-sm font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

/**
 * The engine's one-parameter risk dial (x = l = d = g), from the published
 * risk_dial.csv: each setting carries its closed-form guaranteed bound
 * 2x/(1+x) and the realized backtest stats at that setting. Real data —
 * the slider selects among the seven configurations actually run.
 */
export function RiskDial() {
  const defaultIndex = DIAL.findIndex((row) => row.x === "8%");
  const [index, setIndex] = useState(defaultIndex === -1 ? 3 : defaultIndex);
  const row = DIAL[index];

  const chartData = useMemo(
    () =>
      DIAL.map((d, i) => ({
        x: d.x,
        bound: +(d.bound * 100).toFixed(2),
        realized: +(-d.maxDD * 100).toFixed(2),
        selected: i === index,
      })),
    [index],
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <ChartLegend
          items={[
            { label: "Guaranteed bound 2x/(1+x)", color: "var(--chart-3)" },
            { label: "Realized max drawdown", color: "var(--chart-1)" },
          ]}
        />
        <span className="font-mono text-[11px] text-muted-foreground">
          Collar engine · real backtest output
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barGap={2}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="x"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            width={40}
            tickFormatter={(v: number) => `${v}%`}
          />
          <Tooltip
            content={(props) => <ChartTooltip {...props} formatter={(v) => `${v.toFixed(1)}%`} />}
            cursor={{ fill: "var(--muted)" }}
          />
          <Bar dataKey="bound" name="Guaranteed bound" radius={[3, 3, 0, 0]} barSize={18}>
            {chartData.map((d) => (
              <Cell key={d.x} fill="var(--chart-3)" opacity={d.selected ? 1 : 0.35} />
            ))}
          </Bar>
          <Bar dataKey="realized" name="Realized MaxDD" radius={[3, 3, 0, 0]} barSize={18}>
            {chartData.map((d) => (
              <Cell key={d.x} fill="var(--chart-1)" opacity={d.selected ? 1 : 0.35} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-5">
        <StatTile label="Guaranteed bound" value={`${(row.bound * 100).toFixed(1)}%`} />
        <StatTile label="Realized MaxDD" value={`${(row.maxDD * 100).toFixed(1)}%`} />
        <StatTile label="CAGR" value={`${(row.cagr * 100).toFixed(1)}%`} />
        <StatTile label="Sharpe" value={row.sharpe.toFixed(2)} />
        <StatTile label="Floor violations" value={String(row.floorViolations)} />
      </dl>

      <div className="mt-5 rounded-lg border border-border bg-muted/20 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-medium">
            Risk dial: <span className="font-mono text-primary">x = {row.x}</span>
            <span className="ml-2 text-xs text-muted-foreground">
              (x = loss budget = drawdown limit = gain trigger)
            </span>
          </span>
          <span className="text-xs text-muted-foreground">
            Pick the guarantee; the backtest reports what it earned
          </span>
        </div>
        <Slider
          value={[index]}
          onValueChange={(v) => setIndex(Array.isArray(v) ? v[0] : (v as number))}
          min={0}
          max={DIAL.length - 1}
          step={1}
        />
        <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
          {DIAL.map((d) => (
            <span key={d.x}>{d.x}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
