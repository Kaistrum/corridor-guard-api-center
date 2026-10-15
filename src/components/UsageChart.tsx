import { cn } from "@kaistrum/stratum-ui";

export interface UsagePoint {
  label: string;
  value: number;
}

interface UsageChartProps {
  data: UsagePoint[];
  /** Appended in tooltips, e.g. "calls". */
  unit?: string;
  className?: string;
}

const fmt = new Intl.NumberFormat("en-US");

/**
 * Single-series magnitude-over-time chart: thin accent bars anchored to the
 * baseline with 4px rounded tops, a recessive gridline, and a per-bar hover
 * tooltip. One series, so no legend — the surrounding card title names it.
 */
export function UsageChart({ data, unit = "", className }: UsageChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const peakIndex = data.reduce(
    (best, d, i) => (d.value > data[best].value ? i : best),
    0,
  );
  // Show a handful of x labels so they don't collide.
  const labelEvery = Math.ceil(data.length / 7);

  return (
    <div className={cn("w-full", className)}>
      <div className="relative flex h-52 items-end gap-[2px]">
        {/* Recessive gridlines */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-t border-border-subtle" />
          ))}
        </div>

        {data.map((d, i) => {
          const heightPct = (d.value / max) * 100;
          return (
            <div
              key={d.label}
              className="group relative flex flex-1 items-end"
              style={{ height: "100%" }}
            >
              <div
                className={cn(
                  "w-full rounded-t-[4px] bg-accent transition-colors group-hover:bg-accent-strong",
                  d.value === 0 && "bg-border",
                )}
                style={{ height: `${Math.max(heightPct, 1.5)}%` }}
              />
              {/* Direct label on the peak only */}
              {i === peakIndex && d.value > 0 && (
                <span className="pointer-events-none absolute inset-x-0 -top-5 text-center text-xs font-medium text-text-dim">
                  {fmt.format(d.value)}
                </span>
              )}
              {/* Hover tooltip */}
              <div className="pointer-events-none absolute bottom-[calc(100%+0.25rem)] left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-radius-md border border-border bg-drop-bg px-2.5 py-1.5 text-xs shadow-md group-hover:block">
                <span className="font-medium text-text">{fmt.format(d.value)}</span>
                {unit && <span className="text-text-dim"> {unit}</span>}
                <span className="block text-text-muted">{d.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* X axis */}
      <div className="mt-2 flex gap-[2px]">
        {data.map((d, i) => (
          <span
            key={d.label}
            className="flex-1 text-center text-[11px] text-text-muted"
          >
            {i % labelEvery === 0 ? d.label : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
