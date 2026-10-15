import { Badge, Card, CountUp, Progress } from "@kaistrum/stratum-ui";
import { UsageChart, type UsagePoint } from "./UsageChart";
import { INITIAL_KEYS } from "@/lib/data";

const DAILY_CALLS: UsagePoint[] = [
  { label: "Oct 1", value: 1240 },
  { label: "Oct 2", value: 1580 },
  { label: "Oct 3", value: 1320 },
  { label: "Oct 4", value: 1760 },
  { label: "Oct 5", value: 980 },
  { label: "Oct 6", value: 870 },
  { label: "Oct 7", value: 1410 },
  { label: "Oct 8", value: 1890 },
  { label: "Oct 9", value: 2240 },
  { label: "Oct 10", value: 2010 },
  { label: "Oct 11", value: 1670 },
  { label: "Oct 12", value: 1120 },
  { label: "Oct 13", value: 1980 },
  { label: "Oct 14", value: 2360 },
];

// Deterministic per-key request counts for the breakdown.
const KEY_CALLS = [9820, 6240, 3410, 1180];
const TOTAL_KEY_CALLS = KEY_CALLS.reduce((a, b) => a + b, 0);

const STAT_TILES = [
  { value: "23,220", label: "Requests (30d)" },
  { value: "99.4%", label: "Success rate" },
  { value: "182ms", label: "Avg. latency" },
  { value: "4", label: "Active keys" },
];

const STATUS_BREAKDOWN = [
  { code: "2xx Success", count: "23,080", variant: "success" as const },
  { code: "4xx Client error", count: "126", variant: "warning" as const },
  { code: "5xx Server error", count: "14", variant: "danger" as const },
];

export function StatisticsView() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Statistics</h1>
        <p className="mt-1 text-text-dim">
          Usage across all of your API keys for the last 30 days.
        </p>
      </header>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_TILES.map((s) => (
          <Card key={s.label} padding="standard">
            <CountUp value={s.value} className="text-2xl font-bold text-text" />
            <p className="mt-1 text-sm text-text-dim">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Usage over time */}
      <Card className="mt-6" padding="spacious">
        <div className="mb-5 flex items-baseline justify-between">
          <div>
            <h2 className="font-semibold text-text">API calls per day</h2>
            <p className="text-sm text-text-dim">Last 14 days</p>
          </div>
          <Badge variant="success" dot>
            +18% vs. prior
          </Badge>
        </div>
        <UsageChart data={DAILY_CALLS} unit="calls" />
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Requests by key */}
        <Card padding="spacious">
          <h2 className="mb-4 font-semibold text-text">Requests by key</h2>
          <div className="space-y-4">
            {INITIAL_KEYS.map((k, i) => (
              <Progress
                key={k.id}
                label={k.name}
                value={KEY_CALLS[i] ?? 0}
                max={TOTAL_KEY_CALLS}
                showValue
              />
            ))}
          </div>
        </Card>

        {/* Status breakdown */}
        <Card padding="spacious">
          <h2 className="mb-4 font-semibold text-text">Response status</h2>
          <ul className="divide-y divide-border-subtle">
            {STATUS_BREAKDOWN.map((s) => (
              <li
                key={s.code}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <Badge variant={s.variant} dot>
                  {s.code}
                </Badge>
                <span className="font-mono text-sm text-text">{s.count}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-text-muted">
            Error responses include a JSON body with a <code>message</code> and{" "}
            <code>code</code> to help you debug integrations.
          </p>
        </Card>
      </div>
    </div>
  );
}
