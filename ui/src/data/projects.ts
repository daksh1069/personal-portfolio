export type Metric = { label: string; value: string };

export type Project = {
  slug: string;
  title: string;
  org: string;
  period: string;
  summary: string;
  bullets: string[];
  metrics: Metric[];
  tags: string[];
  chart: "convexity" | "variance" | "vol-surface";
};

export const projects: Project[] = [
  {
    slug: "convexity-protection",
    title: "Optimal Hedging of Leveraged ETF Positions (Convexity Protection)",
    org: "North Carolina State University",
    period: "May 2026 – Present",
    summary:
      "A Python backtesting engine for a \"convexity protection\" strategy on Tesla's 2× leveraged ETF (TSLL) — short the LETF, long calls — harvesting structural volatility decay while capping tail risk, 2022–2026.",
    bullets: [
      "Built a Python backtesting engine for a convexity-protection strategy on TSLL — short the LETF, long calls — to harvest structural volatility decay while capping tail risk, over 2022–2026.",
      "Validated TSLL's volatility decay via the Avellaneda–Zhang decomposition, isolating leveraged exposure, daily-reset decay, and financing frictions from realized fund returns.",
      "Backtested delta-neutral call hedges (ATM / 10% / 20% OTM) using a least-premium TSLA-vs-TSLL call ensemble rule; the 10%-OTM hedge cut maximum drawdown from −79.6% (naked short) to −23.5% and raised the Sharpe to 0.69 (Calmar 0.78) at a 100% fill rate.",
    ],
    metrics: [
      { label: "Max Drawdown (naked short)", value: "−79.6%" },
      { label: "Max Drawdown (10% OTM hedge)", value: "−23.5%" },
      { label: "Sharpe", value: "0.69" },
      { label: "Calmar", value: "0.78" },
    ],
    tags: ["Python", "Options", "Backtesting", "Volatility Decay", "Delta Hedging"],
    chart: "convexity",
  },
  {
    slug: "variance-risk-premium",
    title: "Variance Risk Premium & Variance-Swap Replication (SPX)",
    org: "North Carolina State University",
    period: "Jun 2026",
    summary:
      "Replicated a 30-day SPX variance swap from option strips (CBOE VIX methodology) and backtested a cost-aware short-variance carry strategy across 2017–2023, including the 2020 COVID regime.",
    bullets: [
      "Replicated a 30-day SPX variance swap from option strips (model-free implied variance, CBOE VIX methodology), validating the synthetic index against the live VIX across 2017–2023 (1,676 days) to a 0.57 vol-point mean error and 0.99 correlation.",
      "Measured the variance risk premium at +3.75 vol points on average (positive 84% of days), quantifying its collapse in crises — implied vol of 17% in Feb 2020 vs. ~90% subsequently realized.",
      "Backtested a cost-aware short-variance carry (net Sharpe 1.84, 18% CAGR) with modeled transaction/bid-ask costs, vega-notional sizing, and a realized-vol tail stop, capturing a −71% maximum drawdown during the 2020 COVID-regime collapse; shipped an interactive Streamlit dashboard.",
    ],
    metrics: [
      { label: "VIX Tracking Correlation", value: "0.99" },
      { label: "Mean Tracking Error", value: "0.57 vol-pts" },
      { label: "Net Sharpe (carry)", value: "1.84" },
      { label: "CAGR", value: "18%" },
    ],
    tags: ["Options", "Variance Swaps", "VIX", "Streamlit", "Risk Premia"],
    chart: "variance",
  },
  {
    slug: "vol-model-calibration",
    title: "Calibration and Hedging of Local, Stochastic, and Hybrid Volatility Models",
    org: "North Carolina State University",
    period: "Jan 2026 – May 2026",
    summary:
      "A unified calibration and hedging framework for Local (Dupire), Stochastic (Heston), and Stochastic-Local Volatility (SLV) models across 5,000+ SPX option contracts.",
    bullets: [
      "Developed a unified calibration and hedging framework in Python for Local (Dupire), Stochastic (Heston), and Stochastic-Local Volatility (SLV) models using 5,000+ SPX option contracts.",
      "Constructed an arbitrage-free volatility surface via SVI parameterization, achieving an overall RMSE of 2.47% and a 94% convergence rate for Black-Scholes inversion using the Secant Method.",
      "Implemented a finite-difference PDE solver for the Dupire model and calibrated Heston parameters to capture dynamic smile effects, reducing pricing errors by ~15% in deep out-of-the-money strikes.",
      "Benchmarked Delta-hedging performance against a Black-Scholes baseline, demonstrating a 12% reduction in P&L leakage across a 1-year backtest, and stress-tested model robustness against the 2020 COVID-19 regime, maintaining surface stability with a maximum RMSE of 3.8% during peak VIX periods.",
    ],
    metrics: [
      { label: "Surface RMSE", value: "2.47%" },
      { label: "BS Inversion Convergence", value: "94%" },
      { label: "Deep-OTM Error Reduction", value: "~15%" },
      { label: "P&L Leakage Reduction", value: "12%" },
    ],
    tags: ["Dupire", "Heston", "SVI", "PDE", "Delta Hedging"],
    chart: "vol-surface",
  },
];
