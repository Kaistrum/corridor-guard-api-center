import Link from "next/link";
import { Badge, Button, Card, Divider, Progress } from "@kaistrum/stratum-ui";

const INVOICES = [
  { id: "INV-2024-010", date: "Oct 1, 2024", amount: "$149.00", status: "Paid" },
  { id: "INV-2024-009", date: "Sep 1, 2024", amount: "$149.00", status: "Paid" },
  { id: "INV-2024-008", date: "Aug 1, 2024", amount: "$149.00", status: "Paid" },
];

export function BillingView() {
  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Billing</h1>
        <p className="mt-1 text-text-dim">
          Manage your plan, payment method, and invoices.
        </p>
      </header>

      {/* Current plan */}
      <Card padding="spacious">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-text">Growth plan</h2>
              <Badge variant="accent">Current</Badge>
            </div>
            <p className="mt-1 text-sm text-text-dim">
              $149 / month · renews Nov 1, 2024
            </p>
          </div>
          <Link href="/manage-plan">
            <Button variant="outline">Change plan</Button>
          </Link>
        </div>

        <Divider className="my-6" />

        <p className="mb-4 text-sm font-medium text-text">This billing cycle</p>
        <div className="space-y-4">
          <Progress label="API requests" value={23220} max={50000} showValue />
          <Progress label="WebSocket messages" value={8600} max={25000} showValue />
        </div>
      </Card>

      {/* Payment method */}
      <Card className="mt-6" padding="spacious">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-text">Payment method</h2>
            <p className="mt-1 text-sm text-text-dim">
              Visa ending in 4242 · expires 08/27
            </p>
          </div>
          <Button variant="ghost">Update</Button>
        </div>
      </Card>

      {/* Invoices */}
      <Card className="mt-6" padding="spacious">
        <h2 className="mb-4 font-semibold text-text">Invoices</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-text-muted">
                <th className="py-2.5 pr-4 font-medium">Invoice</th>
                <th className="py-2.5 pr-4 font-medium">Date</th>
                <th className="py-2.5 pr-4 font-medium">Amount</th>
                <th className="py-2.5 pr-4 font-medium">Status</th>
                <th className="py-2.5" />
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="border-b border-border-subtle last:border-0">
                  <td className="py-3 pr-4 font-mono text-text">{inv.id}</td>
                  <td className="py-3 pr-4 text-text-dim">{inv.date}</td>
                  <td className="py-3 pr-4 text-text">{inv.amount}</td>
                  <td className="py-3 pr-4">
                    <Badge variant="success" dot>
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      className="text-sm font-medium text-accent hover:underline"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
