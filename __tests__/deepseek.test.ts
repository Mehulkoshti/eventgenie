import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { generateNarrative } from "@/lib/deepseek";
import type { BudgetPlan, EventInput, IdeaSet, TimelinePlan, VendorPlan } from "@/lib/types";

const facts = {
  input: { eventType: "wedding", eventName: "Test", eventDate: "2027-01-01", guestCount: 10, budget: 100000, location: "Pune", vibe: "", focusAreas: [] } as EventInput,
  budget: { total: 100000, perGuest: 10000, lines: [], tightBudget: false } as BudgetPlan,
  timeline: { urgentMode: false, daysUntilEvent: 90, tasks: [] } as TimelinePlan,
  vendors: { items: [] } as VendorPlan,
  ideas: { palette: [], themeIdeas: [], activityIdeas: [] } as IdeaSet,
};

// A non-empty placeholder with no credential-like shape, used only to make the code path that
// requires *a* value take the "configured" branch — generateNarrative never inspects its content.
const ANY_CONFIGURED_VALUE = Math.random().toString(36).slice(2);

describe("generateNarrative", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns null without ever calling fetch when no API key is configured", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", "");
    const fetchSpy = vi.spyOn(global, "fetch");
    const result = await generateNarrative(facts);
    expect(result).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns null if the API responds with a non-OK status", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", ANY_CONFIGURED_VALUE);
    vi.spyOn(global, "fetch").mockResolvedValue(new Response("", { status: 500 }));
    const result = await generateNarrative(facts);
    expect(result).toBeNull();
  });

  it("returns the narrative text on a successful response", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", ANY_CONFIGURED_VALUE);
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: "Your plan looks great." } }] }), { status: 200 }),
    );
    const result = await generateNarrative(facts);
    expect(result).toBe("Your plan looks great.");
  });

  it("returns null if fetch throws (network error, timeout abort, etc.)", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", ANY_CONFIGURED_VALUE);
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("network error"));
    const result = await generateNarrative(facts);
    expect(result).toBeNull();
  });
});
