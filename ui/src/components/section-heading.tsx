import { Reveal } from "@/components/reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal className="mb-10 max-w-2xl md:mb-14">
      <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-balance text-muted-foreground">{description}</p>
      ) : null}
    </Reveal>
  );
}
