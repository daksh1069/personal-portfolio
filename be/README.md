# Backend (`be/`)

A Python venv, not a running server. Its only job right now is to
precompute the JSON that drives the interactive charts in `ui/`, so the
site can stay 100% static (free + fast) while still having "real" data
behind the sliders.

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Usage

```bash
source .venv/bin/activate
python scripts/generate_convexity_grid.py
```

Writes the same JSON to two places:
- `be/data/convexity_grid.json` — kept here for reference/inspection
- `ui/src/data/generated/convexity-grid.json` — what the frontend actually imports

Re-run this (and commit the regenerated JSON) any time you change the
generator script. The frontend just imports the JSON at build time — it
never calls into Python at runtime.

## What's here vs. what's real

`scripts/generate_convexity_grid.py` is a **placeholder parametric model**,
not the real TSLL backtest engine — it's tuned so the 10%-OTM scenario
reproduces the actual reported numbers (max drawdown −23.5%, Sharpe 0.69,
Calmar 0.78) and interpolates a plausible curve around it for the other
grid points. Swap the body of that script for a call into the real
backtester whenever it's available; the JSON shape is the contract with
the frontend and can stay the same.

## If a project later needs live recompute (not just this precomputed grid)

Two free-tier options, not yet built:

- **Vercel Python serverless function** — supported on the free Hobby tier
  (stateless, ~10s execution limit, cold starts). Fine for a lightweight
  numpy/pandas recompute per request.
- **Upstash Redis** (free tier, 10K commands/day, integrates natively with
  Vercel) — cache expensive results keyed by request params so repeat
  requests are instant.

Only worth doing once a project needs truly arbitrary/continuous
parameters rather than picking a point on a fixed grid.
