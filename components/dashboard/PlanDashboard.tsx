import type { PlanResult } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BudgetBreakdown } from "./BudgetBreakdown";
import { TimelineChecklist } from "./TimelineChecklist";
import { VendorChecklist } from "./VendorChecklist";
import { IdeaCards } from "./IdeaCards";

export function PlanDashboard({ plan, onStartOver }: { plan: PlanResult; onStartOver: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-2xl font-bold">{plan.input.eventName}</h2>
          <p className="text-sm text-slate-500">
            {plan.input.location} · {plan.input.guestCount} guests ·{" "}
            {new Date(plan.input.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => window.print()}>
            Export / Print
          </Button>
          <Button variant="ghost" onClick={onStartOver}>
            Start over
          </Button>
        </div>
      </div>

      {plan.aiNarrative && (
        <Card className="border-indigo-200 bg-indigo-50/60 dark:border-indigo-900 dark:bg-indigo-950/40">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            AI-personalized summary
          </p>
          <p className="text-sm leading-relaxed">{plan.aiNarrative}</p>
        </Card>
      )}

      {!plan.aiEnhanced && (
        <p className="text-xs text-slate-400">
          Showing the deterministic plan (AI narrative unavailable right now) — every number below is computed the same
          way either way.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <BudgetBreakdown budget={plan.budget} />
        <TimelineChecklist timeline={plan.timeline} />
        <VendorChecklist vendors={plan.vendors} />
        <IdeaCards ideas={plan.ideas} />
      </div>
    </div>
  );
}
