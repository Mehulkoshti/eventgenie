import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/plan/route";

function makeRequest(body: unknown, ip: string): NextRequest {
  return new NextRequest("http://localhost/api/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

const validInput = {
  eventType: "wedding",
  eventName: "Rhea & Dev's Wedding",
  eventDate: "2027-03-15",
  guestCount: 200,
  budget: 500000,
  location: "Jaipur",
  vibe: "royal",
  focusAreas: ["Catering"],
};

describe("POST /api/plan", () => {
  it("returns a full deterministic plan for valid input", async () => {
    const res = await POST(makeRequest(validInput, "test-client-1"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.budget.total).toBe(500000);
    expect(json.timeline.tasks.length).toBeGreaterThan(0);
    // No DEEPSEEK_API_KEY in the test environment, so it must fall back gracefully.
    expect(json.aiEnhanced).toBe(false);
  });

  it("rejects invalid input with 400 and no crash", async () => {
    const res = await POST(makeRequest({ ...validInput, eventType: "not-a-type" }, "test-client-2"));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeTruthy();
  });

  it("rejects malformed JSON with 400", async () => {
    const req = new NextRequest("http://localhost/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "test-client-3" },
      body: "{not valid json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rate-limits a client after repeated requests", async () => {
    const ip = "test-client-rate-limit";
    let lastStatus = 200;
    for (let i = 0; i < 11; i++) {
      const res = await POST(makeRequest(validInput, ip));
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });
});
