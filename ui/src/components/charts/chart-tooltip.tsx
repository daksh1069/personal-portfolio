"use client";

type ChartTooltipEntry = {
  dataKey?: string | number;
  name?: string;
  value?: number | string;
  color?: string;
};

export function ChartTooltip({
  active,
  label,
  payload,
  formatter,
}: {
  active?: boolean;
  label?: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: ReadonlyArray<any>;
  formatter?: (value: number) => string;
}) {
  if (!active || !payload?.length) return null;
  const entries = payload as ChartTooltipEntry[];

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="mb-1.5 font-mono text-muted-foreground">{label}</p>
      <div className="flex flex-col gap-1">
        {entries.map((entry) => (
          <div key={entry.dataKey as string} className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="ml-auto font-mono font-medium tabular-nums text-foreground">
              {formatter && typeof entry.value === "number"
                ? formatter(entry.value)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
