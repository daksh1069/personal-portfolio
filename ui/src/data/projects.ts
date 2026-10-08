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
  chart: "floor-engine" | "vrp" | "ird" | "vol-surface" | "lob";
  /** Path under /public to an embeddable live demo page, if one exists. */
  demo?: string;
  /** Path under /public to a full write-up PDF, if one exists. */
  report?: string;
  /** GitHub repository for this project. */
  repoUrl?: string;
  /** True when the project's charts render real backtest/analysis output. */
  realData: boolean;
  /** True to keep the project out of the site (no card, no detail page). */
  hidden?: boolean;
};

const allProjects: Project[] = [
  {
    slug: "convexity-protection",
    title: "Optimal Hedging of Leveraged ETF Positions (Convexity Protection)",
    org: "North Carolina State University",
    period: "May 2026 – Present",
    summary:
      "A multi-tranche hedging engine on Tesla's 2× leveraged ETF (TSLL) — short the LETF, long ATM calls, short OTM puts (a collar) — harvesting structural volatility decay with maximum drawdown capped ex ante by a closed-form, model-free bound. The bound is fixed before the data run; the realized equity path never breached it.",
    bullets: [
      "Each tranche's worst-case loss is an exact no-arbitrage limit — L = C + K_c − S₀ (call-only) or L − P_p (collar) — valid continuously rather than only at expiry, via no-arbitrage bounds on American options.",
      "Settlement-based accounting keys the risk budget to checkpoint equity instead of daily marks (removing procyclicality); a cycle ceiling converts equity peaks into checkpoints, yielding the closed-form guarantee MaxDD ≤ (d + g)/(1 + g) = 15.0% at the headline configuration, and a one-parameter risk limit x with bound 2x/(1 + x).",
      "Verification: the bound was never breached in-sample, out-of-sample, or across seven risk-limit configurations — 960 trading days each; realized drawdowns used 75–96% of their guaranteed envelopes, so the bound is informative, not vacuous.",
      "Collar (frictionless): +15.69% CAGR, Sharpe 0.899, −12.29% MaxDD (Calmar 1.28) vs. −81.1% MaxDD for the unhedged short. With approximate borrow fees, call-only earns +13.42% at −15.44% MaxDD; the borrow cost is measured and added to the bound, so it remains a theorem.",
      "A cost gate deploys capital only when the net floor cost is ≤ 15% of protected notional (removing it cuts CAGR from 14.0% to 4.9%); selling rich TSLL crash insurance (median ~10% of spot) cuts the net floor cost by roughly a third.",
      "Data: full TSLA/TSLL option-chain history 2020–2026 (1M+ daily option prices) built via a Bloomberg BDH + OpenFIGI pipeline, with spot/OHLCV via yfinance.",
    ],
    metrics: [
      { label: "Guaranteed MaxDD bound (ex ante)", value: "15.0%" },
      { label: "Bound breaches (960 days)", value: "0" },
      { label: "CAGR / Sharpe (collar)", value: "+15.69% / 0.90" },
      { label: "Unhedged-short MaxDD", value: "−81.1%" },
    ],
    tags: ["Python", "Options", "LETF", "Collar", "No-Arbitrage Bounds", "Bloomberg", "Backtesting"],
    chart: "floor-engine",
    report: "/reports/tsla-tsll-hedging-report.pdf",
    repoUrl: "https://github.com/daksh1069/dynamic_hedging_letf",
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
    repoUrl: "https://github.com/daksh1069/variance-risk-premium",
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
    repoUrl: "https://github.com/daksh1069/interest-rate-derivatives-engine",
    realData: true,
    hidden: true,
  },
  {
    slug: "lob-engine",
    title: "Low-Latency Limit Order Book Engine & Market Data Parser (C++20)",
    org: "Independent project",
    period: "Jul 2026",
    summary:
      "A C++20 engine that parses Databento DBN market-by-order binary data, reconstructs a NASDAQ limit order book, and benchmarks end-to-end throughput and latency on a full real trading day — with an animated replay dashboard that plays the session back like a video, embedded live below.",
    bullets: [
      "Streaming zstd DBN reader with zero-copy parsing and no per-record allocation; wire-struct layouts pinned by static_asserts. Parse-only throughput ~28M records/s (36 ns/record including decompression), single-threaded on Apple silicon at -O3.",
      "Order book keyed by an order-ID hash map plus a sorted map of occupied price levels per side — memory scales with resting orders, not price-range width. Handles add, partial/full cancel, modify, fill, and session clear.",
      "Full day of AAPL market-by-order data (2024-01-05, XNAS.ITCH): 4,772,682 records — 2.26M adds, 2.28M cancels, 106K fills — parsed and reconstructed in 0.42 s (~11.4M events/s), with book-update latency of 42 ns p50 / 125 ns p99 / 209 ns p99.9.",
      "Validation: per-action record counts match the official Python databento client exactly; Catch2 unit tests cover the parser and book; vcpkg manifest mode keeps all C++ dependencies project-local.",
      "The replay dashboard is a single self-contained HTML file generated by the engine: all 147,390 top-of-book changes (ms-timestamped, delta-encoded) and all 102,958 regular-hours fills in a live time & sales tape, with transport controls (play/pause, 0.5–15 market-min/s, scrubber) — the same file embedded on this page.",
    ],
    metrics: [
      { label: "Parse throughput", value: "~28M rec/s" },
      { label: "Parse + book build", value: "11.4M ev/s" },
      { label: "Book update p50 / p99", value: "42 / 125 ns" },
      { label: "Records validated", value: "4.77M" },
    ],
    tags: ["C++20", "Low Latency", "Market Microstructure", "DBN/ITCH", "zstd", "CMake", "Catch2"],
    chart: "lob",
    demo: "/replay/lob-replay.html",
    repoUrl: "https://github.com/daksh1069/lob_and_data_parser",
    realData: true,
    hidden: true,
  },
  {
    slug: "vol-model-calibration",
    title: "Volatility Surface Calibration — SVI, Local Vol & Heston (SPX)",
    org: "North Carolina State University (group project)",
    period: "Jan 2026 – May 2026",
    summary:
      "An SPX volatility-surface pipeline: options cleaning, Black-Scholes implied vols via a hand-rolled Secant solver, put-call-parity forwards, an SVI surface calibrated with no-arbitrage penalties, Dupire local vol extracted from it, and a Heston model calibrated to the same surface for a like-for-like comparison.",
    bullets: [
      "Cleaned and filtered SPX end-of-day option chains, then computed Black-Scholes implied vols with a Secant-method root finder: 94.1% call / 94.4% put convergence across 5,024 options; per-expiry forwards and discount factors estimated from put-call parity.",
      "Calibrated a full SVI surface (SSVI seed, then per-slice refinement in total-variance space with Durrleman butterfly and calendar-spread penalties): overall RMSE of 2.38 vol points across 4,655 options and 46 expiries — 1.09 at the money — with 44/46 slices butterfly-arbitrage-free and worst calendar crossedness of 0.0028 in total variance.",
      "Extracted Dupire local volatility from the calibrated surface via Gatheral's local-variance formula (analytic SVI x-derivatives, finite differences in T): valid on 93.5% of a 37-expiry × 71-strike grid, with failures concentrated where the small calendar crossings make ∂w/∂T negative.",
      "Calibrated Heston by differential evolution on characteristic-function pricing (little-Heston-trap formulation, Gauss-Legendre integration): IV RMSE of 0.78 vol points vs SVI's 1.29 on the identical subsample (T ≥ 30d, |x| ≤ 0.25), with ρ = −0.99 capturing the SPX skew and the Feller condition satisfied.",
      "Every number above is computed by scripts in the repo from its committed result files; the interactive surface below renders the actual calibrated parameters.",
    ],
    metrics: [
      { label: "SVI surface RMSE", value: "2.38 vol pts" },
      { label: "Secant IV convergence", value: "94%" },
      { label: "Heston IV RMSE (T≥30d)", value: "0.78 vol pts" },
      { label: "Butterfly-arb-free slices", value: "44/46" },
    ],
    tags: ["SVI", "Dupire", "Heston", "No-Arbitrage", "SPX Options", "SciPy"],
    chart: "vol-surface",
    repoUrl: "https://github.com/daksh1069/volatility-surface-calibration",
    realData: true,
  },
];

export const projects = allProjects.filter((p) => !p.hidden);
