# Daksh Kumar — Portfolio

Personal portfolio site: quant finance / ML projects, experience, and background.

## Layout

- **`ui/`** — Next.js 16 frontend (TypeScript, Tailwind v4, shadcn/ui, Framer Motion, Recharts). This is what deploys to Vercel. See [`ui/README.md`](ui/README.md).
- **`be/`** — Python venv. Precomputes the scenario-grid JSON that powers the interactive charts (e.g. the OTM% hedge slider on the Convexity Protection project page) and writes it straight into `ui/src/data/generated/`. Nothing here runs at request time — it's an offline data-generation step, so hosting stays free and pages stay static. See [`be/README.md`](be/README.md).

## Quick start

```bash
# Frontend (what you want 95% of the time)
cd ui && npm install && npm run dev        # http://localhost:3000

# Regenerate simulated backtest data (only needed if you change be/scripts/*)
cd be && source .venv/bin/activate && python scripts/generate_convexity_grid.py
```

## Data flow

Everything currently renders from data in `ui/src/data/` (resume content) and
`ui/src/data/generated/` (JSON produced by `be/`) — no live backend, no
database, no API calls at runtime. That's intentional: it's the fastest and
cheapest way to host a portfolio (pure static + CDN caching on Vercel).

If a project later needs *live* interactivity beyond a precomputed grid
(arbitrary parameter recompute, not just picking a point on a slider), the
plan is a Vercel Python serverless function backed by Upstash Redis
(free tier) for caching — see notes in `be/README.md`. Nothing like that
exists yet.

## Deploy

Hosted on Vercel (free Hobby tier). When connecting the repo in Vercel, set
**Root Directory** to `ui`. Production builds and preview deploys happen
automatically on push once connected — see [`ui/README.md`](ui/README.md)
for the dev-vs-prod command breakdown.
