import { skills } from "@/data/skills";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";

export function Skills() {
  return (
    <section id="skills" className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading eyebrow="Toolbox" title="Skills" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.05}>
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {group.label}
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <Badge key={item} variant="outline" className="font-normal">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
