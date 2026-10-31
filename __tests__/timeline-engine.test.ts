import { describe, expect, it } from "vitest";
import { buildTimeline } from "@/lib/timeline-engine";
import type { EventInput } from "@/lib/types";

const baseInput: EventInput = {
  eventType: "birthday",
  eventName: "Test Birthday",
  eventDate: "",
  guestCount: 50,
  budget: 100000,
  location: "Pune",
  vibe: "neon",
  focusAreas: [],
};

describe("buildTimeline", () => {
  it("is not in urgent mode when there is ample runway", () => {
    const now = new Date("2026-01-01");
    const eventDate = new Date(now);
    eventDate.setDate(eventDate.getDate() + 120);
    const plan = buildTimeline({ ...baseInput, eventDate: eventDate.toISOString() }, now);
    expect(plan.urgentMode).toBe(false);
    expect(plan.tasks.every((t) => !t.overdue)).toBe(true);
  });

  it("switches to urgent mode and compresses tasks when the event is very close", () => {
    const now = new Date("2026-01-01");
    const eventDate = new Date(now);
    eventDate.setDate(eventDate.getDate() + 5);
    const plan = buildTimeline({ ...baseInput, eventDate: eventDate.toISOString() }, now);
    expect(plan.urgentMode).toBe(true);
    // Every task must still fall on/before the event, i.e. due dates are compressed into the runway.
    expect(plan.tasks.every((t) => new Date(t.dueDate).getTime() <= eventDate.getTime())).toBe(true);
  });

  it("marks tasks overdue when their due date has already passed", () => {
    const now = new Date("2026-06-01");
    const eventDate = new Date("2026-06-10");
    const plan = buildTimeline({ ...baseInput, eventDate: eventDate.toISOString() }, now);
    expect(plan.tasks.some((t) => t.overdue)).toBe(true);
  });

  it("preserves relative task ordering after compression", () => {
    const now = new Date("2026-01-01");
    const eventDate = new Date(now);
    eventDate.setDate(eventDate.getDate() + 3);
    const plan = buildTimeline({ ...baseInput, eventDate: eventDate.toISOString() }, now);
    const sorted = [...plan.tasks].sort((a, b) => b.daysBeforeEvent - a.daysBeforeEvent);
    expect(sorted.map((t) => t.id)).toEqual(plan.tasks.map((t) => t.id));
  });
});
