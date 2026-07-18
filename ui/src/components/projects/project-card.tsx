import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { ConvexityChart } from "@/components/charts/convexity-chart";
import { VarianceChart } from "@/components/charts/variance-chart";
import { VolSmileChart } from "@/components/charts/vol-smile-chart";

const chartComponents = {
  convexity: ConvexityChart,
  variance: VarianceChart,
  "vol-surface": VolSmileChart,
} as const;

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ChartComponent = chartComponents[project.chart];

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

            <Link
              href={`/projects/${project.slug}`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              View interactive breakdown
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <ul className="mt-5 space-y-2.5">
              {project.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2.5 text-sm text-foreground/85">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {bullet}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 lg:col-span-3 sm:p-8">
            <ChartComponent />

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
