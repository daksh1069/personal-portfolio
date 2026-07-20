# Daksh Kumar — Portfolio

Personal portfolio site: quant finance / ML projects, experience, and background.

## Layout

- **`ui/`** — Next.js 16 frontend (TypeScript, Tailwind v4, shadcn/ui, Framer Motion, Recharts). This is what deploys to Vercel. See [`ui/README.md`](ui/README.md).
- **`be/`** — Python venv. Exports **real published results** from the source project repositories (the TSLA/TSLL guaranteed-floor engine, the SPX variance-swap replication, the IRD pricing engine) into `ui/src/data/generated/*.json`. Nothing here runs at request time — it's an offline export step, so hosting stays free and pages stay static. See [`be/README.md`](be/README.md) for the source-repo table and integrity rules.

## Quick start

```bash
# Frontend (what you want 95% of the time)
cd ui && npm install && npm run dev        # http://localhost:3000

# Re-export real project results (needs the source repos on this machine)
cd be && source .venv/bin/activate && python scripts/export_site_data.py
```

## Data flow

Everything renders from data in `ui/src/data/` (resume content) and
`ui/src/data/generated/` (real result files exported by `be/`) — no live
backend, no database, no API calls at runtime. That's intentional: it's the
fastest and cheapest way to host a portfolio (pure static + CDN caching on
Vercel). The dynamic-hedging project's full LaTeX report is served at
`/reports/tsla-tsll-hedging-report.pdf`.

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
