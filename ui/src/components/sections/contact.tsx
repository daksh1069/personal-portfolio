import { FileDown, Mail } from "lucide-react";
import { site } from "@/data/site";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function Contact() {
  return (
    <section id="contact" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Get in touch
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Let&apos;s talk quant, ML, or your next hire.
          </h2>
          <p className="mt-4 text-balance text-muted-foreground">
            Currently based in {site.location} and open to quant research, quant dev, and applied
            AI roles. The fastest way to reach me is email.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${site.email}`}
              className={cn(buttonVariants({ size: "lg" }), "gap-2")}
            >
              <Mail className="h-4 w-4" />
              {site.email}
            </a>
            <a
              href={site.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "gap-2")}
            >
              <LinkedinIcon className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href={site.links.github}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "gap-2")}
            >
              <GithubIcon className="h-4 w-4" />
              GitHub
            </a>
            <a
              href={site.links.resume}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ size: "lg", variant: "ghost" }), "gap-2")}
            >
              <FileDown className="h-4 w-4" />
              Resume
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
