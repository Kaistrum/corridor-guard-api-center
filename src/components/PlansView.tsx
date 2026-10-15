import { useState } from "react";
import { Badge, Button, Card, Switch, cn } from "@kaistrum/stratum-ui";
import { CheckIcon } from "./icons";

interface Plan {
  id: string;
  name: string;
  monthly: number;
  blurb: string;
  features: string[];
  current?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    monthly: 0,
    blurb: "For evaluation and small projects.",
    features: [
      "5,000 API requests / mo",
      "1 API key",
      "GeoJSON export",
      "Community support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    monthly: 149,
    blurb: "For production GIS integrations.",
    features: [
      "50,000 API requests / mo",
      "Webhook & email alerts",
      "Unlimited API keys",
      "GeoJSON · MVT · WFS",
      "Email support",
    ],
    current: true,
  },
  {
    id: "scale",
    name: "Scale",
    monthly: 499,
    blurb: "For high-volume and team usage.",
    features: [
      "500,000 API requests / mo",
      "Hourly automated re-scans",
      "Team access controls",
      "99.9% uptime SLA",
      "Priority support",
    ],
  },
];

export function PlansView() {
  const [annual, setAnnual] = useState(false);

  const priceFor = (plan: Plan) => {
    if (plan.monthly === 0) return "$0";
    const value = annual ? Math.round(plan.monthly * 0.8) : plan.monthly;
    return `$${value}`;
  };

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Manage plan</h1>
        <p className="mt-1 text-text-dim">
          Change your subscription at any time. Changes are prorated to your next
          invoice.
        </p>
      </header>

      <div className="mb-6 flex items-center gap-3">
        <Switch
          checked={annual}
          onChange={(e) => setAnnual(e.target.checked)}
          label="Annual billing"
        />
        <Badge variant="success">Save 20%</Badge>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            padding="spacious"
            className={cn(
              "flex flex-col",
              plan.current && "ring-1 ring-accent",
            )}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text">{plan.name}</h2>
              {plan.current && <Badge variant="accent">Current</Badge>}
            </div>
            <p className="mt-1 text-sm text-text-dim">{plan.blurb}</p>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-text">{priceFor(plan)}</span>
              <span className="text-sm text-text-muted">
                {plan.monthly === 0 ? "forever" : "/ month"}
              </span>
            </div>

            <ul className="mt-5 flex-1 space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-text-dim">
                  <CheckIcon
                    width={16}
                    height={16}
                    className="mt-0.5 shrink-0 text-accent"
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.current ? "outline" : "primary"}
              fullWidth
              disabled={plan.current}
              className="mt-6"
            >
              {plan.current
                ? "Current plan"
                : plan.monthly === 0
                  ? "Downgrade"
                  : "Upgrade"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
