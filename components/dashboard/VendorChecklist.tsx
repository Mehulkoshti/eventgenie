import type { VendorPlan } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { PriorityBadge } from "@/components/ui/Badge";

export function VendorChecklist({ vendors }: { vendors: VendorPlan }) {
  return (
    <Card>
      <h3 className="text-lg font-semibold">Vendor checklist</h3>
      <ul className="mt-4 space-y-3">
        {vendors.items.map((item) => (
          <li key={item.category} className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{item.category}</p>
              <PriorityBadge priority={item.priority} />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Typical lead time: {item.leadTimeWeeks} weeks
              {item.bookImmediately && (
                <span className="ml-2 font-semibold text-rose-600">Book immediately — lead time is tight</span>
              )}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.tips}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
