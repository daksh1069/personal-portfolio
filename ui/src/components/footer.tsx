import { GraduationCap, Mail } from "lucide-react";
import { site } from "@/data/site";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { VisitorCount } from "@/components/visitor-count";

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-4">
          <p>
            © {new Date().getFullYear()} {site.name}. Built with Next.js & Tailwind.
          </p>
          <VisitorCount />
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`mailto:${site.email}`}
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
            Email
          </a>
          <a
            href={site.links.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </a>
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <LinkedinIcon className="h-4 w-4" />
            LinkedIn
          </a>
          <a
            href={site.links.ncsuProfile}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <GraduationCap className="h-4 w-4" />
            NCSU Profile
          </a>
        </div>
      </div>
    </footer>
  );
}
