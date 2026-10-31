import { describe, expect, it } from "vitest";
import { buildIdeas } from "@/lib/idea-engine";
import type { EventInput } from "@/lib/types";

const baseInput: EventInput = {
  eventType: "birthday",
  eventName: "Test",
  eventDate: "2027-01-01",
  guestCount: 50,
  budget: 100000,
  location: "Mumbai",
  vibe: "",
  focusAreas: [],
};

describe("buildIdeas", () => {
  it("matches a palette based on vibe keywords", () => {
    const ideas = buildIdeas({ ...baseInput, vibe: "pastel garden" });
    expect(ideas.palette).toEqual(["#F7D9DA", "#F4E9E1", "#CDE6D0", "#FFFFFF"]);
  });

  it("falls back to an event-type-specific default palette for unmatched vibes", () => {
    const birthday = buildIdeas({ ...baseInput, vibe: "something unusual entirely" });
    const wedding = buildIdeas({ ...baseInput, eventType: "wedding", vibe: "something unusual entirely" });
    expect(birthday.palette).not.toEqual(wedding.palette);
  });

  it("returns event-type-specific theme and activity ideas", () => {
    const birthday = buildIdeas(baseInput);
    const wedding = buildIdeas({ ...baseInput, eventType: "wedding" });
    expect(birthday.themeIdeas).not.toEqual(wedding.themeIdeas);
    expect(birthday.activityIdeas).not.toEqual(wedding.activityIdeas);
  });

  it.each(["wedding", "birthday", "anniversary", "babyShower", "graduation", "corporate", "community"] as const)(
    "has a distinct default palette for %s",
    (eventType) => {
      const ideas = buildIdeas({ ...baseInput, eventType, vibe: "" });
      expect(ideas.palette.length).toBeGreaterThan(0);
    },
  );
});
