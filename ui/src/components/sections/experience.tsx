import { ArrowUpRight } from "lucide-react";
import { experience } from "@/data/experience";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        eyebrow="Career"
        title="Work experience"
        description="Founding engineering roles spanning ML-driven recommendation systems and real-estate data science."
      />

      <div className="relative">
        <div
          aria-hidden
          className="absolute top-1 bottom-1 left-[7px] w-px bg-border sm:left-[9px]"
        />
        <div className="flex flex-col gap-10">
          {experience.map((job, i) => (
            <Reveal key={job.company} delay={i * 0.06} className="relative pl-8 sm:pl-10">
              <span className="absolute top-1.5 left-0 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-primary bg-background sm:h-[18px] sm:w-[18px]" />
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-semibold tracking-tight">
                  {job.role} ·{" "}
                  {job.companyUrl ? (
                    <a
                      href={job.companyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {job.company}
                      <ArrowUpRight className="ml-0.5 inline h-3.5 w-3.5 -translate-y-px" />
                    </a>
                  ) : (
                    <span className="text-primary">{job.company}</span>
                  )}
                </h3>
                <span className="font-mono text-xs text-muted-foreground">{job.period}</span>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{job.location}</p>
              <ul className="mt-3 space-y-2">
                {job.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2.5 text-sm text-foreground/85">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
