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
  chart: "floor-engine" | "vrp" | "ird" | "vol-surface";
  /** Path under /public to a full write-up PDF, if one exists. */
  report?: string;
  /** True when the project's charts render real backtest/analysis output. */
  realData: boolean;
};

export const projects: Project[] = [
  {
    slug: "convexity-protection",
    title: "Drawdown-Constrained Convexity Protection on a Leveraged ETF (TSLA/TSLL)",
    org: "North Carolina State University",
    period: "May 2026 – Present",
    summary:
      "A multi-tranche hedging engine that shorts a 2× leveraged ETF (TSLL) against long same-instrument calls — optionally collared with short OTM puts — whose maximum drawdown is capped by a closed-form, model-free bound rather than an observed backtest number. Every risk statement is registered before the data run and verified after it.",
    bullets: [
      "Each tranche's worst-case loss is an exact algebraic reservation — L = C + K_c − S₀ (call-only) or L − P_p (collar) — that holds continuously, not just at expiry, via no-arbitrage bounds on American options.",
      "Settled-equity accounting keys the risk budget to checkpoint equity instead of daily marks (removing procyclicality); a cycle ceiling converts equity peaks into checkpoints, yielding the master equation MaxDD ≤ (d + g)/(1 + g) = 15.0% at the headline configuration, and a one-parameter risk dial x with bound 2x/(1 + x).",
      "Verified: zero leak-adjusted floor violations across all full-period variants, holdout halves, and seven risk-dial settings — 960 trading days each; realized drawdowns used 75–96% of their guaranteed envelopes, so the bound is informative, not vacuous.",
      "Collar (frictionless): +15.69% CAGR, Sharpe 0.899, −12.29% MaxDD (Calmar 1.28) vs. the naked-short benchmark's −81.1% MaxDD. With approximate borrow fees, call-only earns +13.42% at −15.44% MaxDD; the borrow leak is measured and added to the bound, so it remains a theorem.",
      "A favorability gate deploys only when the net floor cost is ≤ 15% of protected notional (removing it cuts CAGR from 14.0% to 4.9%); selling rich TSLL crash insurance (median ~10% of spot) cuts the net floor cost by roughly a third.",
      "Data: full TSLA/TSLL option-chain history 2020–2026 (530k+ TSLA call rows) built via a Bloomberg BDH + OpenFIGI pipeline, with spot/OHLCV via yfinance.",
    ],
    metrics: [
      { label: "Guaranteed MaxDD bound", value: "15.0%" },
      { label: "Floor violations (960 days)", value: "0" },
      { label: "CAGR / Sharpe (collar)", value: "+15.69% / 0.90" },
      { label: "Naked-short benchmark MaxDD", value: "−81.1%" },
    ],
    tags: ["Python", "Options", "LETF", "Collar", "No-Arbitrage Bounds", "Bloomberg", "Backtesting"],
    chart: "floor-engine",
    report: "/reports/tsla-tsll-hedging-report.pdf",
    realData: true,
  },
  {
    slug: "variance-risk-premium",
    title: "Variance Risk Premium & Variance-Swap Replication (SPX)",
    org: "North Carolina State University",
    period: "Jun 2026",
    summary:
      "Replicates a 30-day SPX variance swap from option strips (model-free implied variance, CBOE VIX methodology), validates the synthetic index against the live VIX, measures the variance risk premium with strictly forward-looking realized variance, and backtests a cost-aware short-variance carry.",
    bullets: [
      "Replicated 30-day implied variance from SPX option chains (Databento OPRA, 2017–2023, 1,676 trading days): 0.568 vol-point mean absolute error and 0.9909 correlation against the real CBOE VIX, with no regime where the replication breaks down (per-year MAE 0.32–0.76).",
      "Validation surfaced and fixed three real data bugs: stale-tick corruption of the put-call-parity forward (min-volume gate), invalid time-interpolation when monthly expiries fail to straddle 30 days (dates dropped, not extrapolated), and exchange reuse of instrument IDs (bars re-keyed by their own embedded symbol).",
      "Measured the VRP at +3.75 vol points on average (positive 83.7% of days) with strictly forward-looking realized variance; regime breakdown shows it thinning to +2.3 in 2020/2022, and single days as negative as −72.3 vol points in Feb 2020 — implied vol did not come close to pricing COVID in advance.",
      "Backtested a rolling short-variance carry with per-entry 1/n vega-notional sizing, 10 bps entry costs, and a backward-looking realized-vol tail stop: net Sharpe 1.84, 18.0% CAGR, +221% total, with a −70.6% max drawdown concentrated entirely in the COVID window — reported as the structural limitation of a tail stop, not hidden.",
      "Interactive Streamlit dashboard with live-recomputable costs/sizing/estimator controls; the fixed 30-day tenor control is disabled rather than silently faked.",
    ],
    metrics: [
      { label: "VIX correlation", value: "0.9909" },
      { label: "Mean abs error", value: "0.568 vol pts" },
      { label: "Net Sharpe / CAGR", value: "1.84 / 18.0%" },
      { label: "Mean VRP (83.7% days > 0)", value: "+3.75 vol pts" },
    ],
    tags: ["Options", "Variance Swaps", "VIX", "Databento", "Streamlit", "Risk Premia"],
    chart: "vrp",
    realData: true,
  },
  {
    slug: "ird-pricing-engine",
    title: "Interest Rate Derivatives Pricing Engine (Swaptions)",
    org: "Independent project",
    period: "Jun 2026",
    summary:
      "An end-to-end fixed-income engine in pure Python/NumPy — no SciPy: every numerical routine (bootstrap root-find, cubic spline, monotone-convex interpolation, NSS fit, inverse-normal CDF, quasi-random sequences) implemented directly. Bootstraps Treasury zero curves from FRED, calibrates Hull-White, prices European and Bermudan swaptions by Monte Carlo, and runs hedging backtests and stress tests.",
    bullets: [
      "Bootstrapped daily zero curves from 2,206 FRED Treasury par-yield dates (2018–2026, 11 pillars) under the no-arbitrage par condition, with log-linear, natural-cubic-spline, and Hagan–West monotone-convex interpolation; max pillar reprice error 0.31 bp, NSS fit RMSE 5.8 bp.",
      "Calibrated Hull-White (a = 0.063, σ = 125 bp) to a 4×3 ATM swaption normal-vol surface via Jamshidian decomposition: fit RMSE 2.75 bp, max error 4.9 bp; the model reprices the initial discount curve to ~1e-16 by construction (Brigo–Mercurio reconstruction).",
      "Vectorized Monte Carlo with antithetic + control variates and Halton QMC: matches the Jamshidian analytic to 0.022 bp at 200k paths (CV), QMC error 0.0005 bp at 16k paths; Longstaff-Schwartz prices the Bermudan at an 80.4 bp early-exercise premium over the European.",
      "Walk-forward delta-hedging backtest (1Y×5Y receiver, 262 days): DV01-neutral swap hedge cut daily P&L volatility 26.1× (14.6 bp/day → 0.56 bp/day), with theta/delta/gamma/vega attribution reconciling to ~1 bp/day residual.",
      "Risk & stress: bump-and-reprice key-rate DV01s that sum to the parallel DV01 exactly, curve/vol/historical-replay scenarios (COVID, 2022 hikes, SVB), 1-day historical VaR/CVaR, and reverse stress; 22 independent cross-component identity checks pass.",
    ],
    metrics: [
      { label: "Hull-White fit RMSE", value: "2.75 bp" },
      { label: "MC vs analytic error", value: "0.022 bp" },
      { label: "Bermudan exercise premium", value: "80.4 bp" },
      { label: "Hedge variance reduction", value: "26.1×" },
    ],
    tags: ["NumPy", "Hull-White", "Monte Carlo", "Longstaff-Schwartz", "Yield Curves", "FRED"],
    chart: "ird",
    realData: true,
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
    realData: false,
  },
];
