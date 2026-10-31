import { RotateCcw, Sparkles } from "lucide-react";
import type { PlanResult } from "@/lib/types";
import { EVENT_TYPE_LABELS } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { BudgetBreakdown } from "./BudgetBreakdown";
import { TimelineChecklist } from "./TimelineChecklist";
import { VendorChecklist } from "./VendorChecklist";
import { IdeaCards } from "./IdeaCards";
import { DownloadPdfButton } from "./DownloadPdfButton";

export function PlanDashboard({ plan, onStartOver }: { plan: PlanResult; onStartOver: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            {EVENT_TYPE_LABELS[plan.input.eventType]}
          </p>
          <h2 className="text-2xl font-bold">{plan.input.eventName}</h2>
          <p className="text-sm text-slate-500">
            {plan.input.location} · {plan.input.guestCount} guests ·{" "}
            {new Date(plan.input.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex gap-2">
          <DownloadPdfButton plan={plan} />
          <Button variant="ghost" onClick={onStartOver}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Start over
          </Button>
        </div>
      </div>

      {plan.aiNarrative && (
        <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 dark:border-indigo-900 dark:from-indigo-950/40 dark:to-violet-950/40">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            AI-personalized summary
          </p>
          <p className="text-sm leading-relaxed">{plan.aiNarrative}</p>
        </Card>
      )}

      {!plan.aiEnhanced && (
        <Alert variant="info" role="status">
          Showing the deterministic plan — the AI narrative is unavailable right now, but every number below is
          computed the same way either way.
        </Alert>
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
