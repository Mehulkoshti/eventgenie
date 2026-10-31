import { Store, AlertTriangle } from "lucide-react";
import type { VendorPlan } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { PriorityBadge } from "@/components/ui/Badge";

export function VendorChecklist({ vendors }: { vendors: VendorPlan }) {
  return (
    <Card>
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
          <Store className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="text-lg font-semibold">Vendor checklist</h3>
      </div>

      <ul className="mt-4 space-y-3">
        {vendors.items.map((item) => (
          <li key={item.category} className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{item.category}</p>
              <PriorityBadge priority={item.priority} />
            </div>
            <p className="mt-1 text-xs text-slate-500">Typical lead time: {item.leadTimeWeeks} weeks</p>
            {item.bookImmediately && (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                Book immediately — lead time is tight
              </p>
            )}
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{item.tips}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
