"use client";

import { useMemo, useState } from "react";
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
import { Slider } from "@/components/ui/slider";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { ChartLegend } from "@/components/charts/chart-legend";
import { convexityProtectionSeries } from "@/lib/mock-series";
import convexityGrid from "@/data/generated/convexity-grid.json";

const OTM_LEVELS = convexityGrid.otmLevels;
const GRID_SERIES = convexityGrid.series as Record<string, number[]>;
const GRID_STATS = convexityGrid.stats as Record<
  string,
  { maxDrawdown: number; sharpe: number; calmar: number; totalReturnPct: number }
>;

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/40 px-3 py-3">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono text-sm font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

export function ConvexityInteractiveChart() {
  const defaultIndex = Math.max(OTM_LEVELS.indexOf(10), 0);
  const [index, setIndex] = useState(defaultIndex);
  const otm = OTM_LEVELS[index];

  const data = useMemo(() => {
    const hedged = GRID_SERIES[String(otm)];
    return convexityGrid.months.map((month, i) => ({
      month,
      hedged: hedged[i],
      nakedShort: convexityProtectionSeries[i]?.nakedShort,
    }));
  }, [otm]);

  const stats = GRID_STATS[String(otm)];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <ChartLegend
          items={[
            { label: `${otm}% OTM hedge`, color: "var(--chart-1)" },
            { label: "Naked short", color: "var(--chart-5)" },
          ]}
        />
        <span className="font-mono text-[11px] text-muted-foreground">Indexed to 100 · simulated</span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
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
            dataKey="hedged"
            name={`${otm}% OTM hedge`}
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="nakedShort"
            name="Naked short"
            stroke="var(--chart-5)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
        <StatTile label="Max Drawdown" value={`${stats.maxDrawdown}%`} />
        <StatTile label="Sharpe" value={stats.sharpe.toFixed(2)} />
        <StatTile label="Calmar" value={stats.calmar.toFixed(2)} />
        <StatTile label="Total Return" value={`+${stats.totalReturnPct}%`} />
      </dl>

      <div className="mt-6 rounded-lg border border-border bg-muted/20 p-4">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-medium">
            Hedge distance: <span className="font-mono text-primary">{otm}% OTM</span>
          </span>
          <span className="text-xs text-muted-foreground">Re-runs the precomputed scenario grid</span>
        </div>
        <Slider
          value={[index]}
          onValueChange={(v) => setIndex(Array.isArray(v) ? v[0] : (v as number))}
          min={0}
          max={OTM_LEVELS.length - 1}
          step={1}
        />
        <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
          {OTM_LEVELS.map((lvl) => (
            <span key={lvl}>{lvl}%</span>
          ))}
        </div>
      </div>
    </div>
  );
}
