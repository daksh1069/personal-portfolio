"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileDown, MapPin } from "lucide-react";
import { site } from "@/data/site";
import { buttonVariants } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Guaranteed MaxDD bound (LETF hedge)", value: "15.0%" },
  { label: "Net Sharpe (short-variance carry)", value: "1.84" },
  { label: "VIX replication corr.", value: "0.9909" },
  { label: "Delta-hedge variance reduction", value: "26.1×" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:56px_56px] opacity-[0.35] [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent)]"
      />

      <div className="mx-auto flex max-w-6xl flex-col items-start px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 font-mono text-xs text-muted-foreground"
        >
          <MapPin className="h-3 w-3" />
          {site.location} · Open to Quant / AI roles
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl"
        >
          {site.name}
          <span className="mt-2 block text-primary">{site.role}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-5 max-w-2xl text-balance text-lg text-muted-foreground"
        >
          {site.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <a href="/#projects" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
            View Projects
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href={site.links.resume}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "gap-2")}
          >
            <FileDown className="h-4 w-4" />
            Resume
          </a>
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ size: "lg", variant: "ghost" }), "gap-2")}
          >
            <LinkedinIcon className="h-4 w-4" />
            LinkedIn
          </a>
          <a
            href={site.links.github}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ size: "lg", variant: "ghost" }), "gap-2")}
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </a>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.26 }}
          className="mt-16 grid w-full grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-card px-4 py-5">
              <dt className="text-xs text-muted-foreground">{s.label}</dt>
              <dd className="mt-1.5 font-mono text-xl font-semibold tabular-nums sm:text-2xl">
                {s.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
