import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { FloorEquityChart } from "@/components/charts/floor-equity-chart";
import { RiskDial } from "@/components/charts/risk-dial";
import { VrpTrackingChart, VrpEquityChart, VrpPremiumChart } from "@/components/charts/vrp-charts";
import { IrdCurveChart, IrdSpreadChart, IrdVolFitChart } from "@/components/charts/ird-charts";
import { VolSmileChart } from "@/components/charts/vol-smile-chart";
import { PnlLeakageChart } from "@/components/charts/pnl-leakage-chart";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${site.name}`,
    description: project.summary,
  };
}

function ChartBlock({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div>
      {title ? <h3 className="mb-4 text-sm font-semibold tracking-tight">{title}</h3> : null}
      {children}
    </div>
  );
}

function ProjectCharts({ slug }: { slug: string }) {
  switch (slug) {
    case "convexity-protection":
      return (
        <div className="flex flex-col gap-10">
          <ChartBlock title="Engine equity vs. the naked-short benchmark (2022–2026, daily)">
            <FloorEquityChart variant="full" />
          </ChartBlock>
          <div className="border-t border-border pt-8">
            <ChartBlock title="The risk dial: guaranteed bound 2x/(1+x) vs. what the backtest realized">
              <RiskDial />
            </ChartBlock>
          </div>
        </div>
      );
    case "variance-risk-premium":
      return (
        <div className="flex flex-col gap-10">
          <ChartBlock title="Replicated 30-day implied vol vs. the live CBOE VIX (1,676 days)">
            <VrpTrackingChart />
          </ChartBlock>
          <div className="border-t border-border pt-8">
            <ChartBlock title="The variance risk premium (implied − subsequently realized)">
              <VrpPremiumChart />
            </ChartBlock>
          </div>
          <div className="border-t border-border pt-8">
            <ChartBlock title="Cost-aware short-variance carry, compounded NAV">
              <VrpEquityChart />
            </ChartBlock>
          </div>
        </div>
      );
    case "ird-pricing-engine":
      return (
        <div className="flex flex-col gap-10">
          <ChartBlock title="Bootstrapped zero curve, forwards, and NSS fit">
            <IrdCurveChart />
          </ChartBlock>
          <div className="border-t border-border pt-8">
            <ChartBlock title="Hull-White calibration: market vs. model ATM swaption vols">
              <IrdVolFitChart />
            </ChartBlock>
          </div>
          <div className="border-t border-border pt-8">
            <ChartBlock title="2s10s slope across the dataset (the 2022–2024 inversion)">
              <IrdSpreadChart />
            </ChartBlock>
          </div>
        </div>
      );
    case "vol-model-calibration":
      return (
        <div className="flex flex-col gap-8">
          <VolSmileChart />
          <div className="border-t border-border pt-8">
            <PnlLeakageChart />
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All projects
      </Link>

      <Reveal className="mt-6">
        <div className="font-mono text-xs text-muted-foreground">
          {project.org} · {project.period}
        </div>
        <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-4 max-w-3xl text-balance text-muted-foreground">{project.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {project.report ? (
            <a
              href={project.report}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
            >
              <FileText className="h-3.5 w-3.5" />
              Read the full report (PDF)
            </a>
          ) : null}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05} className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <ProjectCharts slug={project.slug} />
        <p className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
          {project.realData
            ? "Charts render the project's actual published result files, exported unmodified from the source repository."
            : "Charts are illustrative reconstructions matching the reported metrics; the underlying course project is not public."}
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Approach & findings</h2>
        <ul className="mt-4 space-y-3">
          {project.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3 text-sm text-foreground/85">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
              {bullet}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.15} className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Results</h2>
        <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="bg-muted/40 px-4 py-4">
              <dt className="text-xs text-muted-foreground">{metric.label}</dt>
              <dd className="mt-1.5 font-mono text-lg font-semibold tabular-nums">{metric.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <div className="mt-16 flex items-center justify-between gap-4 border-t border-border pt-8">
        <Link
          href={`/projects/${prev.slug}`}
          className={cn(buttonVariants({ variant: "outline" }), "gap-1.5")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{prev.title.split(" (")[0]}</span>
          <span className="sm:hidden">Prev</span>
        </Link>
        <Link href={`/projects/${next.slug}`} className={cn(buttonVariants({ variant: "outline" }), "gap-1.5")}>
          <span className="hidden sm:inline">{next.title.split(" (")[0]}</span>
          <span className="sm:hidden">Next</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
