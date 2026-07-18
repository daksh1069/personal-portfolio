# Portfolio — frontend (`ui/`)

Next.js 16 (App Router) + TypeScript + Tailwind v4 + shadcn/ui (Base UI) +
Framer Motion + Recharts. Dark/light/system theming via `next-themes`.

## Development

```bash
npm install
npm run dev
```

Opens on [http://localhost:3000](http://localhost:3000) with hot reload
(Turbopack). This is what you run while editing — every file save updates
the page instantly, no rebuild step.

## Production

Two different things people mean by "production," both below:

**1. Run a real production build locally** (catches type errors, does the
actual optimized build Vercel would do — use this before pushing if you
want a sanity check):

```bash
npm run build   # compiles, type-checks, and statically generates every page
npm run start   # serves the build from step 1 on http://localhost:3000
```

`next dev` and `next start` are not interchangeable — `start` will refuse
to run without a prior `build`, and `dev` skips optimizations you'd want to
verify (bundle size, static generation, etc).

**2. Actual deployment** happens on Vercel, not on your machine — push to
`main` (or open a PR for a preview URL) and Vercel runs `npm run build`
itself. See the root [`README.md`](../README.md) for the Vercel setup notes.

## Linting

```bash
npm run lint
```

## Project structure

```
src/
  app/                     routes (/, /projects/[slug])
  components/
    sections/               homepage sections (Hero, Projects, Experience, …)
    charts/                 Recharts wrappers, one per chart
    projects/               ProjectCard
    ui/                     shadcn/ui primitives — regenerate via `npx shadcn add <name>`
  data/                     site content (resume-derived): projects, experience, education, skills
  data/generated/           JSON written by ../be/scripts/*.py — do not hand-edit
  lib/mock-series.ts        seeded, deterministic chart data for the homepage cards
```

Adding a new project: edit `src/data/projects.ts`. The slug becomes its
detail page route automatically (`/projects/<slug>`) via
`generateStaticParams` in `src/app/projects/[slug]/page.tsx` — wire up a
chart for it in that file's `ProjectCharts` switch.

## Notes

- `Button`/`Slider`/etc. here are shadcn's **Base UI** style, not Radix —
  polymorphism is via a `render` prop, not `asChild`. Link-styled anchors
  use `buttonVariants({...})` directly on an `<a>` instead of
  `<Button asChild>`.
- `lucide-react` in this project's version dropped brand icons (GitHub,
  LinkedIn) — those live as inline SVGs in `src/components/icons.tsx`.
