// Illustrative series for the vol-model-calibration course project only —
// that repo is not public, so its charts are reconstructions built to match
// the reported metrics (labeled as such in the UI). Every other project's
// charts read real exported results from src/data/generated/.

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

// SVI smile fit across moneyness (illustrative).
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
