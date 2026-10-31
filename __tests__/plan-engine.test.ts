import { describe, expect, it } from "vitest";
import { buildDeterministicPlan } from "@/lib/plan-engine";
import type { EventInput } from "@/lib/types";

const baseInput: EventInput = {
  eventType: "wedding",
  eventName: "Test Wedding",
  eventDate: "2027-03-15",
  guestCount: 200,
  budget: 1000000,
  location: "Jaipur",
  vibe: "royal",
  focusAreas: ["Catering"],
};

describe("buildDeterministicPlan", () => {
  it("assembles budget, timeline, vendors and ideas from a single input", () => {
    const now = new Date("2026-12-01");
    const plan = buildDeterministicPlan(baseInput, now);

    expect(plan.input).toEqual(baseInput);
    expect(plan.budget.total).toBe(baseInput.budget);
    expect(plan.timeline.tasks.length).toBeGreaterThan(0);
    expect(plan.vendors.items.length).toBeGreaterThan(0);
    expect(plan.ideas.palette.length).toBeGreaterThan(0);
  });

  it("starts as not AI-enhanced, with no narrative, until the API route adds one", () => {
    const plan = buildDeterministicPlan(baseInput);
    expect(plan.aiEnhanced).toBe(false);
    expect(plan.aiNarrative).toBeUndefined();
  });

  it("stamps generatedAt from the provided clock, defaulting to now", () => {
    const fixed = new Date("2026-06-15T10:00:00.000Z");
    const plan = buildDeterministicPlan(baseInput, fixed);
    expect(plan.generatedAt).toBe(fixed.toISOString());
  });

  it("passes the vendor checklist the timeline's actual days-until-event (not a hardcoded value)", () => {
    const soon = new Date("2027-03-10"); // 5 days before the event
    const plan = buildDeterministicPlan(baseInput, soon);
    const venue = plan.vendors.items.find((i) => i.category === "Venue");
    expect(venue?.bookImmediately).toBe(true);
  });
});
