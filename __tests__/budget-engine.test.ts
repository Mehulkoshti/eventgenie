import { describe, expect, it } from "vitest";
import { allocateBudget } from "@/lib/budget-engine";
import type { EventInput } from "@/lib/types";

const baseInput: EventInput = {
  eventType: "wedding",
  eventName: "Test Wedding",
  eventDate: "2027-01-01",
  guestCount: 200,
  budget: 1000000,
  location: "Jaipur",
  vibe: "royal",
  focusAreas: [],
};

describe("allocateBudget", () => {
  it("allocates lines that sum to ~100% of the budget", () => {
    const plan = allocateBudget(baseInput);
    const totalAllocated = plan.lines.reduce((sum, l) => sum + l.amount, 0);
    expect(totalAllocated).toBeGreaterThan(baseInput.budget * 0.98);
    expect(totalAllocated).toBeLessThanOrEqual(baseInput.budget);
  });

  it("computes per-guest spend correctly", () => {
    const plan = allocateBudget(baseInput);
    expect(plan.perGuest).toBe(Math.round(baseInput.budget / baseInput.guestCount));
  });

  it("flags a tight-budget warning when per-guest spend is too low", () => {
    const plan = allocateBudget({ ...baseInput, budget: 50000, guestCount: 500 });
    expect(plan.tightBudget).toBe(true);
    expect(plan.warning).toBeDefined();
  });

  it("does not flag a warning for a healthy budget", () => {
    const plan = allocateBudget({ ...baseInput, budget: 5000000, guestCount: 100 });
    expect(plan.tightBudget).toBe(false);
    expect(plan.warning).toBeUndefined();
  });

  it("uses different allocation rules per event type", () => {
    const wedding = allocateBudget(baseInput);
    const community = allocateBudget({ ...baseInput, eventType: "community" });
    expect(wedding.lines.map((l) => l.category)).not.toEqual(community.lines.map((l) => l.category));
  });

  it("guards against zero guest count", () => {
    const plan = allocateBudget({ ...baseInput, guestCount: 0 });
    expect(Number.isFinite(plan.perGuest)).toBe(true);
  });
});
