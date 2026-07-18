import { GraduationCap, SquareArrowOutUpRight } from "lucide-react";
import { education } from "@/data/education";
import { site } from "@/data/site";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";

export function Education() {
  return (
    <section id="education" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading eyebrow="Background" title="Education" />
      <div className="grid gap-6 md:grid-cols-2">
        {education.map((edu, i) => (
          <Reveal key={edu.school} delay={i * 0.06}>
            <div className="h-full rounded-xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold tracking-tight">{edu.school}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{edu.degree}</p>
                  </div>
                </div>
                <span className="font-mono text-xs whitespace-nowrap text-muted-foreground">
                  {edu.period}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">{edu.location}</span>
                <span className="font-mono font-medium text-foreground">GPA {edu.gpa}</span>
              </div>

              {edu.coursework ? (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {edu.coursework.map((course) => (
                    <Badge key={course} variant="outline" className="font-normal">
                      {course}
                    </Badge>
                  ))}
                </div>
              ) : null}

              {edu.school.includes("North Carolina") ? (
                <a
                  href={site.links.ncsuProfile}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  View NCSU faculty/student profile
                  <SquareArrowOutUpRight className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
