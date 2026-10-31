import { Wallet } from "lucide-react";
import type { BudgetPlan } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";

const formatInr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export function BudgetBreakdown({ budget }: { budget: BudgetPlan }) {
  return (
    <Card>
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
          <Wallet className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-lg font-semibold">Budget breakdown</h3>
          <p className="text-sm text-slate-500">
            Total {formatInr(budget.total)} · ~{formatInr(budget.perGuest)} per guest
          </p>
        </div>
      </div>

      {budget.warning && (
        <div className="mt-4">
          <Alert variant="warning" title="Tight budget" role="alert">
            {budget.warning}
          </Alert>
        </div>
      )}

      <table className="mt-4 w-full text-sm">
        <caption className="sr-only">Budget allocation by category</caption>
        <thead>
          <tr className="text-left text-slate-500">
            <th scope="col" className="py-1 font-medium">Category</th>
            <th scope="col" className="py-1 font-medium">Allocation</th>
            <th scope="col" className="py-1 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {budget.lines.map((line) => (
            <tr key={line.category} className="border-t border-slate-100 dark:border-slate-800">
              <td className="py-2">
                <p className="font-medium">{line.category}</p>
                <p className="text-xs text-slate-500">{line.note}</p>
              </td>
              <td className="py-2 align-top">
                <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                    style={{ width: `${line.percent}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">{line.percent}%</span>
              </td>
              <td className="py-2 text-right align-top font-medium">{formatInr(line.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
