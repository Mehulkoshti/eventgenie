import { describe, expect, it } from "vitest";
import { buildVendorChecklist } from "@/lib/vendor-checklist";
import type { EventInput, EventType } from "@/lib/types";

const ALL_EVENT_TYPES: EventType[] = [
  "wedding",
  "birthday",
  "anniversary",
  "babyShower",
  "graduation",
  "corporate",
  "community",
];

const baseInput: EventInput = {
  eventType: "community",
  eventName: "Test Community Event",
  eventDate: "2027-01-01",
  guestCount: 300,
  budget: 200000,
  location: "Delhi",
  vibe: "",
  focusAreas: [],
};

describe("buildVendorChecklist", () => {
  it("flags book-immediately when days remaining is less than the vendor's lead time", () => {
    const plan = buildVendorChecklist(baseInput, 14); // 2 weeks left
    const venue = plan.items.find((i) => i.category === "Venue & permits")!;
    expect(venue.bookImmediately).toBe(true);
  });

  it("does not flag book-immediately when there is ample lead time", () => {
    const plan = buildVendorChecklist(baseInput, 200);
    const venue = plan.items.find((i) => i.category === "Venue & permits")!;
    expect(venue.bookImmediately).toBe(false);
  });

  it("returns a distinct checklist per event type", () => {
    const community = buildVendorChecklist(baseInput, 100);
    const wedding = buildVendorChecklist({ ...baseInput, eventType: "wedding" }, 100);
    expect(community.items.map((i) => i.category)).not.toEqual(wedding.items.map((i) => i.category));
  });

  it.each(ALL_EVENT_TYPES)("produces a non-empty vendor checklist for %s", (eventType) => {
    const plan = buildVendorChecklist({ ...baseInput, eventType }, 100);
    expect(plan.items.length).toBeGreaterThan(0);
  });
});
