import { allocateBudget } from "./budget-engine";
import { buildTimeline } from "./timeline-engine";
import { buildVendorChecklist } from "./vendor-checklist";
import { buildIdeas } from "./idea-engine";
import type { EventInput, PlanResult } from "./types";

/** Pure, deterministic plan assembly — no network calls, fully unit-testable. */
export function buildDeterministicPlan(input: EventInput, now: Date = new Date()): PlanResult {
  const budget = allocateBudget(input);
  const timeline = buildTimeline(input, now);
  const vendors = buildVendorChecklist(input, timeline.daysUntilEvent);
  const ideas = buildIdeas(input);

  return {
    input,
    budget,
    timeline,
    vendors,
    ideas,
    aiEnhanced: false,
    generatedAt: now.toISOString(),
  };
}
