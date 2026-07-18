"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, FileDown } from "lucide-react";
import { site } from "@/data/site";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="#top" className="font-mono text-sm font-semibold tracking-tight">
          {site.name}
          <span className="text-primary">.</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 sm:flex">
            <a
              href={site.links.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href={site.links.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a
              href={site.links.resume}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "ml-1 gap-1.5")}
            >
              <FileDown className="h-3.5 w-3.5" />
              Resume
            </a>
          </div>

          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-72">
              <SheetTitle className="px-4 pt-4 font-mono">{site.name}</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="mt-4 flex items-center gap-2 border-t border-border px-3 pt-4">
                  <a
                    href={site.links.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
                  >
                    <GithubIcon className="h-4 w-4" />
                  </a>
                  <a
                    href={site.links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
                  >
                    <LinkedinIcon className="h-4 w-4" />
                  </a>
                  <a
                    href={site.links.resume}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
                  >
                    <FileDown className="h-3.5 w-3.5" />
                    Resume
                  </a>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
