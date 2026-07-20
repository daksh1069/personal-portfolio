import { projects } from "@/data/projects";
import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/projects/project-card";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        eyebrow="Selected work"
        title="Quant finance & ML projects"
        description="Backtesting engines, volatility models, and derivatives pricing — charts below render each project's actual published result files (equity curves, calibration fits, validation series), exported unmodified from the source repositories."
      />
      <div className="flex flex-col gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
