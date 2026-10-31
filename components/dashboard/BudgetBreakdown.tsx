import type { BudgetPlan } from "@/lib/types";
import { Card } from "@/components/ui/Card";

const formatInr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export function BudgetBreakdown({ budget }: { budget: BudgetPlan }) {
  return (
    <Card>
      <h3 className="text-lg font-semibold">Budget breakdown</h3>
      <p className="mt-1 text-sm text-slate-500">
        Total {formatInr(budget.total)} · ~{formatInr(budget.perGuest)} per guest
      </p>

      {budget.warning && (
        <p role="alert" className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          ⚠️ {budget.warning}
        </p>
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
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${line.percent}%` }} />
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
