import { describe, expect, it } from "vitest";
import { isRateLimited } from "@/lib/ratelimit";

describe("isRateLimited", () => {
  it("allows requests under the limit", () => {
    const key = "client-a";
    const now = Date.now();
    for (let i = 0; i < 10; i++) {
      expect(isRateLimited(key, now + i)).toBe(false);
    }
  });

  it("blocks requests once the limit is exceeded within the window", () => {
    const key = "client-b";
    const now = Date.now();
    for (let i = 0; i < 10; i++) {
      isRateLimited(key, now + i);
    }
    expect(isRateLimited(key, now + 11)).toBe(true);
  });

  it("allows requests again once the window has passed", () => {
    const key = "client-c";
    const now = Date.now();
    for (let i = 0; i < 10; i++) {
      isRateLimited(key, now + i);
    }
    expect(isRateLimited(key, now + 61_000)).toBe(false);
  });

  it("tracks separate clients independently", () => {
    const now = Date.now();
    for (let i = 0; i < 10; i++) {
      isRateLimited("client-d", now + i);
    }
    expect(isRateLimited("client-e", now)).toBe(false);
  });
});
