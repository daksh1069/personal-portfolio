"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
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
import vrp from "@/data/generated/vrp.json";

function monthLabel(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

/**
 * Synthetic 30-day implied vol (replicated from SPX option strips) vs. the
 * real CBOE VIX, 2017–2023 — 1,676 trading days of real validation data.
 */
export function VrpTrackingChart() {
  const data = useMemo(
    () =>
      vrp.tracking.dates.map((d, i) => ({
        date: monthLabel(d),
        vix: vrp.tracking.vix[i],
        synthetic: vrp.tracking.synthetic[i],
      })),
    [],
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <ChartLegend
          items={[
            { label: "Live CBOE VIX", color: "var(--chart-5)" },
            { label: "Replicated 30-day implied vol", color: "var(--chart-1)" },
          ]}
        />
        <span className="font-mono text-[11px] text-muted-foreground">
          Vol points · real validation data
        </span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="vixRealFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-5)" stopOpacity={0.18} />
              <stop offset="95%" stopColor="var(--chart-5)" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            width={32}
          />
          <Tooltip
            content={(props) => <ChartTooltip {...props} formatter={(v) => v.toFixed(1)} />}
            cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "2 4" }}
          />
          <Area
            type="monotone"
            dataKey="vix"
            name="Live CBOE VIX"
            stroke="var(--chart-5)"
            strokeWidth={1.5}
            fill="url(#vixRealFill)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="synthetic"
            name="Replicated implied vol"
            stroke="var(--chart-1)"
            strokeWidth={1.5}
            fill="none"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Compounded NAV of the cost-aware short-variance carry (net and gross of
 * modeled costs), from the strategy's real daily P&L series.
 */
export function VrpEquityChart() {
  const data = useMemo(
    () =>
      vrp.strategy.dates.map((d, i) => ({
        date: monthLabel(d),
        net: vrp.strategy.netEquity[i],
        gross: vrp.strategy.grossEquity[i],
      })),
    [],
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <ChartLegend
          items={[
            { label: "Net of modeled costs", color: "var(--chart-1)" },
            { label: "Gross", color: "var(--chart-4)" },
          ]}
        />
        <span className="font-mono text-[11px] text-muted-foreground">
          NAV, indexed to 100 · real backtest output
        </span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
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
          <Line type="monotone" dataKey="net" name="Net" stroke="var(--chart-1)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="gross" name="Gross" stroke="var(--chart-4)" strokeWidth={1.5} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * The variance risk premium itself: implied minus subsequently-realized
 * 30-day vol, strictly forward-looking. Positive = variance sellers earn
 * the premium; the deep negative spikes are Feb–Mar 2020.
 */
export function VrpPremiumChart() {
  const data = useMemo(
    () =>
      vrp.vrp.dates.map((d, i) => ({
        date: monthLabel(d),
        vrp: vrp.vrp.vrpVolPts[i],
      })),
    [],
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <ChartLegend items={[{ label: "VRP (implied − realized, vol pts)", color: "var(--chart-2)" }]} />
        <span className="font-mono text-[11px] text-muted-foreground">
          Mean +3.75 · positive 83.7% of days
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="vrpFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            width={36}
          />
          <ReferenceLine y={0} stroke="var(--muted-foreground)" strokeDasharray="2 4" />
          <Tooltip
            content={(props) => <ChartTooltip {...props} formatter={(v) => v.toFixed(1)} />}
            cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "2 4" }}
          />
          <Area
            type="monotone"
            dataKey="vrp"
            name="VRP"
            stroke="var(--chart-2)"
            strokeWidth={1.5}
            fill="url(#vrpFill)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
