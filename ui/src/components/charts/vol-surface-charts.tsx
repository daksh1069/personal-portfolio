"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { ChartLegend } from "@/components/charts/chart-legend";
import volSurface from "@/data/generated/vol-surface.json";

/**
 * 3D-style wireframe of the calibrated surface: strike slices stacked in
 * depth (T), drawn back-to-front in an oblique projection. Real fitted
 * values — SVI implied vol, or the Dupire local vol extracted from it.
 */
export function VolSurface3D({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<"iv" | "lv">("iv");
  const [hover, setHover] = useState<{ T: number; x: number; v: number } | null>(null);

  const W = 640;
  const H = compact ? 300 : 360;
  const padL = 46;
  const padB = 40;
  const padT = 24;
  const depthX = 130;
  const depthY = compact ? 90 : 110;

  const { slices, xGrid, vMin, vMax } = useMemo(() => {
    const xg = volSurface.surface.x as number[];
    const raw =
      mode === "iv"
        ? (volSurface.surface.slices as { T: number; iv: number[] }[]).map((s) => ({
            T: s.T,
            v: s.iv as (number | null)[],
          }))
        : (volSurface.localVolSurface.slices as { T: number; lv: (number | null)[] }[]).map(
            (s) => ({ T: s.T, v: s.lv }),
          );
    const vals = raw.flatMap((s) => s.v).filter((v): v is number => v != null && isFinite(v));
    return {
      slices: raw,
      xGrid: xg,
      vMin: Math.min(...vals),
      vMax: Math.max(...vals),
    };
  }, [mode]);

  const plotW = W - padL - depthX - 16;
  const plotH = H - padT - padB - depthY;

  const project = (xi: number, si: number, v: number) => {
    const depth = si / Math.max(1, slices.length - 1); // 0 = nearest expiry
    const px = padL + (xi / (xGrid.length - 1)) * plotW + depth * depthX;
    const base = H - padB - depth * depthY;
    const py = base - ((v - vMin) / Math.max(1e-9, vMax - vMin)) * plotH;
    return { px, py, base };
  };

  const paths = useMemo(() => {
    return slices
      .map((s, si) => {
        const segs: string[][] = [];
        let cur: string[] = [];
        const pts: { px: number; py: number; xi: number; v: number }[] = [];
        s.v.forEach((v, xi) => {
          if (v == null || !isFinite(v)) {
            if (cur.length > 1) segs.push(cur);
            cur = [];
            return;
          }
          const { px, py } = project(xi, si, v);
          pts.push({ px, py, xi, v });
          cur.push(`${cur.length === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`);
        });
        if (cur.length > 1) segs.push(cur);

        // Translucent fill from the curve down to the slice's floor line.
        let fill = "";
        if (pts.length > 1) {
          const { base } = project(0, si, vMin);
          fill =
            `M${pts[0].px.toFixed(1)},${base.toFixed(1)} ` +
            pts.map((p) => `L${p.px.toFixed(1)},${p.py.toFixed(1)}`).join(" ") +
            ` L${pts[pts.length - 1].px.toFixed(1)},${base.toFixed(1)} Z`;
        }
        return { T: s.T, si, segs: segs.map((seg) => seg.join(" ")), fill, pts };
      })
      .reverse(); // farthest expiry first, nearest drawn last (on top)
  }, [slices, vMin, vMax]); // eslint-disable-line react-hooks/exhaustive-deps

  const fmtT = (t: number) => (t < 1 ? `${Math.round(t * 365)}d` : `${t.toFixed(1)}y`);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
          {(
            [
              ["iv", "Implied vol (SVI)"],
              ["lv", "Local vol (Dupire)"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                mode === key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          {hover
            ? `T=${fmtT(hover.T)}  x=${hover.x.toFixed(2)}  ${mode === "iv" ? "IV" : "LV"}=${hover.v.toFixed(1)}%`
            : "SPX 2023-01 · real fitted surface"}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={mode === "iv" ? "SVI implied volatility surface" : "Dupire local volatility surface"}
        onMouseLeave={() => setHover(null)}
      >
        {paths.map((slice) => (
          <g key={slice.T}>
            {slice.fill ? (
              <path d={slice.fill} fill="var(--chart-1)" opacity={0.05} stroke="none" />
            ) : null}
            {slice.segs.map((d, k) => (
              <path
                key={k}
                d={d}
                fill="none"
                stroke={mode === "iv" ? "var(--chart-1)" : "var(--chart-4)"}
                strokeWidth={1.4}
                opacity={1 - 0.55 * (slice.si / slices.length)}
              />
            ))}
            {slice.pts.map((p) => (
              <circle
                key={p.xi}
                cx={p.px}
                cy={p.py}
                r={7}
                fill="transparent"
                onMouseEnter={() => setHover({ T: slice.T, x: xGrid[p.xi], v: p.v })}
              />
            ))}
          </g>
        ))}

        {/* front-edge x axis */}
        {[-0.3, -0.15, 0, 0.15, 0.3].map((xv) => {
          const xi = xGrid.findIndex((g) => Math.abs(g - xv) < 1e-9);
          if (xi === -1) return null;
          const px = padL + (xi / (xGrid.length - 1)) * plotW;
          return (
            <text
              key={xv}
              x={px}
              y={H - padB + 16}
              textAnchor="middle"
              fontSize={10}
              fill="var(--muted-foreground)"
            >
              {xv === 0 ? "ATM" : xv > 0 ? `+${xv}` : xv}
            </text>
          );
        })}
        <text
          x={padL + plotW / 2}
          y={H - padB + 32}
          textAnchor="middle"
          fontSize={10}
          fill="var(--muted-foreground)"
        >
          log-moneyness ln(K/F)
        </text>

        {/* depth axis (T) */}
        {[0, Math.floor((slices.length - 1) / 2), slices.length - 1].map((si) => {
          const depth = si / Math.max(1, slices.length - 1);
          const px = padL + plotW + depth * depthX + 8;
          const py = H - padB - depth * depthY + 4;
          return (
            <text key={si} x={px} y={py} fontSize={10} fill="var(--muted-foreground)">
              {fmtT(slices[si].T)}
            </text>
          );
        })}

        {/* z axis labels */}
        <text x={8} y={padT + 8} fontSize={10} fill="var(--muted-foreground)">
          {vMax.toFixed(0)}%
        </text>
        <text x={8} y={H - padB - depthY} fontSize={10} fill="var(--muted-foreground)">
          {vMin.toFixed(0)}%
        </text>
      </svg>
    </div>
  );
}

/**
 * Smile fits per expiry: market IVs (dots) vs the SVI fit line, with the
 * calibrated Heston model overlaid where the expiry is in its subsample.
 */
export function SmileFitChart() {
  const smiles = volSurface.smiles;
  const [idx, setIdx] = useState(1);
  const smile = smiles[idx];

  const data = useMemo(() => {
    const byX = new Map<number, { x: number; market?: number; svi?: number; heston?: number }>();
    const get = (x: number) => {
      const key = Math.round(x * 1000) / 1000;
      if (!byX.has(key)) byX.set(key, { x: key });
      return byX.get(key)!;
    };
    smile.market.x.forEach((x: number, i: number) => (get(x).market = smile.market.iv[i]));
    smile.svi.x.forEach((x: number, i: number) => (get(x).svi = smile.svi.iv[i]));
    smile.heston.x.forEach((x: number, i: number) => (get(x).heston = smile.heston.iv[i]));
    return [...byX.values()].sort((a, b) => a.x - b.x);
  }, [smile]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <ChartLegend
          items={[
            { label: "Market IV", color: "var(--chart-5)" },
            { label: "SVI fit", color: "var(--chart-1)" },
            { label: "Heston", color: "var(--chart-3)" },
          ]}
        />
        <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
          {smiles.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setIdx(i)}
              className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
                i === idx
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 14 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="x"
            type="number"
            domain={[-0.32, 0.32]}
            ticks={[-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3]}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            label={{
              value: "log-moneyness ln(K/F)",
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
            width={48}
            domain={["auto", "auto"]}
            tickFormatter={(v: number) => `${v.toFixed(0)}%`}
          />
          <Tooltip
            content={(props) => <ChartTooltip {...props} formatter={(v) => `${v.toFixed(1)}%`} />}
            cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "2 4" }}
          />
          <Scatter dataKey="market" name="Market IV" fill="var(--chart-5)" opacity={0.75} />
          <Line
            type="monotone"
            dataKey="svi"
            name="SVI fit"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="heston"
            name="Heston"
            stroke="var(--chart-3)"
            strokeWidth={1.5}
            strokeDasharray="5 3"
            dot={false}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

/** ATM implied vol term structure across all 46 calibrated expiries. */
export function AtmTermChart() {
  const data = useMemo(
    () =>
      (volSurface.termStructure.T as number[]).map((t, i) => ({
        T: t,
        atm: volSurface.termStructure.atmVol[i],
      })),
    [],
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <ChartLegend items={[{ label: "ATM implied vol", color: "var(--chart-2)" }]} />
        <span className="font-mono text-[11px] text-muted-foreground">
          46 expiries · real calibrated values
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 14 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="T"
            type="number"
            domain={[0, 2]}
            ticks={[0, 0.25, 0.5, 1, 1.5, 2]}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            label={{
              value: "Expiry (years)",
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
            width={48}
            domain={["auto", "auto"]}
            tickFormatter={(v: number) => `${v.toFixed(0)}%`}
          />
          <Tooltip
            content={(props) => <ChartTooltip {...props} formatter={(v) => `${v.toFixed(1)}%`} />}
            cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "2 4" }}
          />
          <Line
            type="monotone"
            dataKey="atm"
            name="ATM vol"
            stroke="var(--chart-2)"
            strokeWidth={2}
            dot={{ r: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
