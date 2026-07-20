import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import type { Project } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { FloorEquityChart } from "@/components/charts/floor-equity-chart";
import { VrpTrackingChart } from "@/components/charts/vrp-charts";
import { IrdCurveChart } from "@/components/charts/ird-charts";
import { VolSmileChart } from "@/components/charts/vol-smile-chart";

function CardChart({ chart }: { chart: Project["chart"] }) {
  switch (chart) {
    case "floor-engine":
      return <FloorEquityChart variant="compact" />;
    case "vrp":
      return <VrpTrackingChart />;
    case "ird":
      return <IrdCurveChart />;
    case "vol-surface":
      return <VolSmileChart />;
  }
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal delay={index * 0.05}>
      <article className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid gap-0 lg:grid-cols-5">
          <div className="p-6 lg:col-span-2 lg:border-r lg:border-border sm:p-8">
            <div className="mb-1 font-mono text-xs text-muted-foreground">
              {project.org} · {project.period}
            </div>
            <h3 className="text-balance text-xl font-semibold tracking-tight">{project.title}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{project.summary}</p>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                href={`/projects/${project.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                View interactive breakdown
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              {project.report ? (
                <a
                  href={project.report}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Full report (PDF)
                </a>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 lg:col-span-3 sm:p-8">
            <CardChart chart={project.chart} />

            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="bg-muted/40 px-3 py-3">
                  <dt className="text-[11px] text-muted-foreground">{metric.label}</dt>
                  <dd className="mt-1 font-mono text-sm font-semibold tabular-nums">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
