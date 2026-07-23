# Backend (`be/`)

A Python venv, not a running server. Its job is to export **real results**
from the source project repositories into the JSON files the frontend
charts import, so the site stays 100% static (free + fast) while every
chart renders actual published backtest/analysis output.

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Usage

```bash
source .venv/bin/activate
python scripts/export_site_data.py
```

Writes each dataset to two places:
- `be/data/generated/*.json` — kept here for reference/inspection
- `ui/src/data/generated/*.json` — what the frontend imports at build time

## Source repositories (machine-local paths, see `PROJECTS` in the script)

| JSON | Source repo | What's exported |
|---|---|---|
| `floor-engine.json` | `dynamic_hedging_project` (FIM 675) | The guaranteed-floor engine's published equity curves (`results/floor_engine/equity_*.csv`), the naked-short benchmark series (`results/double_short/equity.csv`), risk-dial table, lineage, summary, and verification tables |
| `vrp.json` | `variance_risk_premium_variance_swap_replication` | Synthetic-vs-VIX validation series, VRP series, and the carry strategy's daily P&L compounded into NAV (matches RESULTS.md: +221% net, −70.6% MaxDD) |
| `ird.json` | `swaption_project` | Bootstrapped zero/forward/NSS curve, 2s10s history (2,206 FRED dates), Hull-White market-vs-model calibration grid |
| `vol-surface.json` | `volatility-surface-calibration` (branch `heston-dupire-extensions`) | SVI surface evaluated from its calibrated parameters (3D grid + smiles + ATM term structure), Dupire local-vol grid, Heston fit, and the fit/no-arbitrage metrics computed by `src/surface_metrics.py` |

**Integrity rule:** everything charted on the site is copied unmodified from
those repos' published result files. The only derived series are (a) VRP NAV
compounding, which replicates the source repo's own stated methodology and
is checked against its published totals at export time (the script prints
the reconciliation), and (b) unit/indexing conversions (×100 for percent).
The exporter fails loudly if a source repo is missing.

Re-run the exporter (and commit the regenerated JSON) whenever a source
project regenerates its results. The frontend never calls Python at runtime.

The full dynamic-hedging write-up PDF is copied (manually) from
`dynamic_hedging_project/latex/tsla_tsll_hedging_report.pdf` to
`ui/public/reports/tsla-tsll-hedging-report.pdf`.

## If a project later needs live recompute

Two free-tier options, not yet built: a Vercel Python serverless function
(Hobby tier: stateless, ~10s limit) for lightweight recompute, plus Upstash
Redis (free tier) to cache results keyed by request params. Only worth doing
once a page needs truly arbitrary parameters rather than selecting among
precomputed configurations.
