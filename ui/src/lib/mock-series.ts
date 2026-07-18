// Simulated series for the project charts below. Metrics quoted in the resume
// (Sharpe, drawdown, RMSE, correlation, etc.) are real backtest results; the
// day-by-day curves themselves are illustrative reconstructions built to match
// those headline numbers, not the raw backtest output.

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Keyframe = [month: number, value: number];

function interpolate(keyframes: Keyframe[], totalMonths: number, noiseAmplitude: number, seed: number) {
  const rand = mulberry32(seed);
  const out: number[] = [];
  for (let m = 0; m <= totalMonths; m++) {
    let lo = keyframes[0];
    let hi = keyframes[keyframes.length - 1];
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (m >= keyframes[i][0] && m <= keyframes[i + 1][0]) {
        lo = keyframes[i];
        hi = keyframes[i + 1];
        break;
      }
    }
    const span = hi[0] - lo[0];
    const frac = span === 0 ? 0 : (m - lo[0]) / span;
    const base = lo[1] + (hi[1] - lo[1]) * frac;
    const noise = (rand() - 0.5) * 2 * noiseAmplitude * (base / 100);
    out.push(Math.round((base + noise) * 100) / 100);
  }
  return out;
}

function monthLabels(start: string, count: number) {
  const [startYear, startMonth] = start.split("-").map(Number);
  const labels: string[] = [];
  for (let i = 0; i <= count; i++) {
    const d = new Date(startYear, startMonth - 1 + i, 1);
    labels.push(d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }));
  }
  return labels;
}

// --- Project: Convexity Protection (TSLL) — Jan 2022 to Jun 2026 (54 months) ---
const CP_MONTHS = 54;
const cpLabels = monthLabels("2022-01", CP_MONTHS);
const cpNaked = interpolate(
  [
    [0, 100],
    [6, 115],
    [12, 100],
    [18, 140],
    [20, 28.56], // -79.6% drawdown from the 140 peak
    [24, 45],
    [30, 60],
    [36, 80],
    [42, 95],
    [48, 115],
    [54, 135],
  ],
  CP_MONTHS,
  1.1,
  11,
);
const cpHedged = interpolate(
  [
    [0, 100],
    [6, 108],
    [12, 82.6], // -23.5% drawdown from the 108 peak
    [18, 105],
    [24, 125],
    [30, 118],
    [36, 150],
    [42, 175],
    [48, 195],
    [54, 214],
  ],
  CP_MONTHS,
  0.7,
  22,
);
export const convexityProtectionSeries = cpLabels.map((label, i) => ({
  month: label,
  nakedShort: cpNaked[i],
  hedged10pctOtm: cpHedged[i],
}));

// --- Project: Variance Risk Premium (SPX) — Jan 2017 to Dec 2023 (84 months) ---
const VRP_MONTHS = 84;
const vrpLabels = monthLabels("2017-01", VRP_MONTHS);
const vixLike = interpolate(
  [
    [0, 12],
    [12, 14],
    [24, 16],
    [36, 17], // Jan 2020, pre-COVID calm
    [38, 90], // Feb-Mar 2020 spike
    [42, 35],
    [48, 22],
    [60, 20],
    [72, 26],
    [84, 15],
  ],
  VRP_MONTHS,
  2.2,
  33,
);
const replicatedSwap = vixLike.map((v, i) => {
  const rand = mulberry32(44 + i);
  const drift = (rand() - 0.5) * 1.1;
  return Math.round((v + drift) * 100) / 100;
});
export const varianceTrackingSeries = vrpLabels.map((label, i) => ({
  month: label,
  vix: vixLike[i],
  replicated: replicatedSwap[i],
}));

const carryEquity = interpolate(
  [
    [0, 100],
    [12, 112],
    [24, 128],
    [36, 148], // Jan 2020 peak
    [38, 42.9], // -71% drawdown, Feb-Mar 2020
    [40, 55],
    [48, 85],
    [60, 140],
    [72, 240],
    [84, 319],
  ],
  VRP_MONTHS,
  1.3,
  55,
);
export const varianceCarryEquitySeries = vrpLabels.map((label, i) => ({
  month: label,
  equity: carryEquity[i],
}));

// --- Project: Vol Model Calibration — SVI smile fit across moneyness ---
const moneyness = [0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3];
const rand66 = mulberry32(66);
export const volSmileSeries = moneyness.map((k) => {
  const skew = 0.19 + 0.16 * Math.pow(1 - k, 2) + (k < 1 ? 0.05 * (1 - k) : 0);
  const market = Math.round(skew * 1000) / 10;
  const modelError = (rand66() - 0.5) * (k < 0.85 || k > 1.15 ? 2.6 : 1.0);
  const model = Math.round((skew * 100 + modelError) * 10) / 10;
  return { moneyness: k.toFixed(2), market, model };
});

export const hedgingPnlLeakage = [
  { model: "Black-Scholes (baseline)", leakage: 100 },
  { model: "Local + Stochastic Vol (SLV)", leakage: 88 },
];
