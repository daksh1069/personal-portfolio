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
import ird from "@/data/generated/ird.json";

function monthLabel(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

/**
 * The bootstrapped zero curve, instantaneous forwards, and the
 * Nelson-Siegel-Svensson fit — real output from results/bootstrapped_curve.csv
 * (curve date 2026-06-15, monotone-convex interpolation).
 */
export function IrdCurveChart() {
  const data = useMemo(
    () =>
      ird.curve.maturity.map((m, i) => ({
        maturity: m,
        zero: ird.curve.zero[i],
        forward: ird.curve.forward[i],
        nss: ird.curve.nss[i],
      })),
    [],
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <ChartLegend
          items={[
            { label: "Zero rate", color: "var(--chart-1)" },
            { label: "Instantaneous forward", color: "var(--chart-4)" },
            { label: "NSS fit", color: "var(--chart-3)" },
          ]}
        />
        <span className="font-mono text-[11px] text-muted-foreground">
          Curve date 2026-06-15 · real engine output
        </span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 14 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="maturity"
            type="number"
            domain={[0, 30]}
            ticks={[0, 5, 10, 15, 20, 25, 30]}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            label={{
              value: "Maturity (years)",
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
            width={42}
            domain={["auto", "auto"]}
            tickFormatter={(v: number) => `${v.toFixed(1)}%`}
          />
          <Tooltip
            content={(props) => <ChartTooltip {...props} formatter={(v) => `${v.toFixed(2)}%`} />}
            cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "2 4" }}
          />
          <Line type="monotone" dataKey="zero" name="Zero rate" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="forward" name="Inst. forward" stroke="var(--chart-4)" strokeWidth={1.5} dot={false} />
          <Line
            type="monotone"
            dataKey="nss"
            name="NSS fit"
            stroke="var(--chart-3)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * The 2s10s Treasury slope across the full 2018–2026 dataset (real FRED
 * data, 2,206 curve dates) — the 2022–2024 inversion is the negative region.
 */
export function IrdSpreadChart() {
  const data = useMemo(
    () =>
      ird.spread2s10s.dates.map((d, i) => ({
        date: monthLabel(d),
        spread: ird.spread2s10s.bp[i],
      })),
    [],
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <ChartLegend items={[{ label: "2s10s slope (10Y − 2Y)", color: "var(--chart-1)" }]} />
        <span className="font-mono text-[11px] text-muted-foreground">
          Basis points · FRED data, 2018–2026
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="spreadFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
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
            width={40}
          />
          <ReferenceLine y={0} stroke="var(--chart-5)" strokeDasharray="2 4" />
          <Tooltip
            content={(props) => <ChartTooltip {...props} formatter={(v) => `${v.toFixed(0)} bp`} />}
            cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "2 4" }}
          />
          <Area
            type="monotone"
            dataKey="spread"
            name="2s10s"
            stroke="var(--chart-1)"
            strokeWidth={1.5}
            fill="url(#spreadFill)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Hull-White calibration fit: market vs model ATM swaption normal vols
 * across the expiry × tenor grid (solid = market, dashed = model), from
 * results/hw_calibration.txt. Fit RMSE 2.75 bp.
 */
export function IrdVolFitChart() {
  const { expiries, tenors, market, model } = ird.hwCalibration;
  const data = useMemo(
    () =>
      expiries.map((expiry, i) => {
        const row: Record<string, string | number> = { expiry };
        tenors.forEach((tenor, j) => {
          row[`market${tenor}`] = market[i][j];
          row[`model${tenor}`] = model[i][j];
        });
        return row;
      }),
    [expiries, tenors, market, model],
  );

  const tenorColors = ["var(--chart-1)", "var(--chart-4)", "var(--chart-3)"];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <ChartLegend
          items={tenors.map((tenor, j) => ({ label: `${tenor} tenor`, color: tenorColors[j] }))}
        />
        <span className="font-mono text-[11px] text-muted-foreground">
          Solid = market, dashed = model · fit RMSE 2.75 bp
        </span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 14 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="expiry"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            label={{
              value: "Option expiry",
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
            width={36}
            domain={["auto", "auto"]}
          />
          <Tooltip
            content={(props) => <ChartTooltip {...props} formatter={(v) => `${v.toFixed(1)} bp`} />}
            cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "2 4" }}
          />
          {tenors.map((tenor, j) => (
            <Line
              key={`market-${tenor}`}
              type="monotone"
              dataKey={`market${tenor}`}
              name={`Market ${tenor}`}
              stroke={tenorColors[j]}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          ))}
          {tenors.map((tenor, j) => (
            <Line
              key={`model-${tenor}`}
              type="monotone"
              dataKey={`model${tenor}`}
              name={`Model ${tenor}`}
              stroke={tenorColors[j]}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
