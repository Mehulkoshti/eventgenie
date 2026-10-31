import { describe, expect, it } from "vitest";
import { eventInputSchema } from "@/lib/schema";

const validInput = {
  eventType: "wedding",
  eventName: "Rhea & Dev",
  eventDate: "2027-03-15",
  guestCount: 200,
  budget: 500000,
  location: "Jaipur",
  vibe: "royal",
  focusAreas: ["Catering", "Decor"],
};

describe("eventInputSchema", () => {
  it("accepts a valid payload", () => {
    const result = eventInputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects an unknown event type", () => {
    const result = eventInputSchema.safeParse({ ...validInput, eventType: "funeral" });
    expect(result.success).toBe(false);
  });

  it.each(["wedding", "birthday", "anniversary", "babyShower", "graduation", "corporate", "community"])(
    "accepts the %s event type",
    (eventType) => {
      const result = eventInputSchema.safeParse({ ...validInput, eventType });
      expect(result.success).toBe(true);
    },
  );

  it("rejects a non-date eventDate", () => {
    const result = eventInputSchema.safeParse({ ...validInput, eventDate: "not-a-date" });
    expect(result.success).toBe(false);
  });

  it("rejects a zero guest count", () => {
    const result = eventInputSchema.safeParse({ ...validInput, guestCount: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects a budget below the sanity floor", () => {
    const result = eventInputSchema.safeParse({ ...validInput, budget: 10 });
    expect(result.success).toBe(false);
  });

  it("coerces numeric strings from form inputs", () => {
    const result = eventInputSchema.safeParse({ ...validInput, guestCount: "200", budget: "500000" });
    expect(result.success).toBe(true);
  });

  it("defaults focusAreas and vibe when omitted", () => {
    const { eventName, eventType, eventDate, guestCount, budget, location } = validInput;
    const result = eventInputSchema.safeParse({ eventName, eventType, eventDate, guestCount, budget, location });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.focusAreas).toEqual([]);
      expect(result.data.vibe).toBe("");
    }
  });
});
