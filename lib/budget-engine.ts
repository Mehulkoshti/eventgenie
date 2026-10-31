import type { BudgetLine, BudgetPlan, EventInput, EventType } from "./types";

interface AllocationRule {
  category: string;
  percent: number;
  note: string;
}

const ALLOCATION_RULES: Record<EventType, AllocationRule[]> = {
  wedding: [
    { category: "Venue & rentals", percent: 25, note: "Hall/lawn hire, chairs, tenting" },
    { category: "Catering & beverages", percent: 30, note: "Per-plate cost scales with guest count" },
    { category: "Decor & florals", percent: 10, note: "Stage, mandap/backdrop, floral arrangements" },
    { category: "Photography & video", percent: 12, note: "Pre-wedding, event day, edits" },
    { category: "Entertainment & music", percent: 8, note: "DJ, live band, anchor" },
    { category: "Attire, beauty & styling", percent: 8, note: "Outfits, makeup, grooming" },
    { category: "Invitations & stationery", percent: 3, note: "Digital + printed invites" },
    { category: "Contingency", percent: 4, note: "Buffer for last-minute changes" },
  ],
  birthday: [
    { category: "Venue & rentals", percent: 20, note: "Hall, lawn, or at-home setup" },
    { category: "Catering & cake", percent: 30, note: "Food, beverages, custom cake" },
    { category: "Decor & theming", percent: 15, note: "Balloons, backdrop, theme props" },
    { category: "Entertainment & activities", percent: 15, note: "Games, performers, music" },
    { category: "Photography", percent: 8, note: "Candid + portrait coverage" },
    { category: "Invitations & favors", percent: 4, note: "Invites and return gifts" },
    { category: "Attire & styling", percent: 3, note: "Outfits for the celebrant" },
    { category: "Contingency", percent: 5, note: "Buffer for last-minute changes" },
  ],
  community: [
    { category: "Venue & permits", percent: 15, note: "Ground/hall booking and local permits" },
    { category: "Catering & refreshments", percent: 25, note: "Scales with footfall estimate" },
    { category: "Logistics & safety", percent: 20, note: "Seating, signage, first-aid, security" },
    { category: "Entertainment & program", percent: 15, note: "Performers, speakers, activities" },
    { category: "Decor & branding", percent: 10, note: "Stage, banners, signage" },
    { category: "Promotion & stationery", percent: 5, note: "Flyers, social posts, passes" },
    { category: "Contingency", percent: 10, note: "Buffer for weather/turnout surprises" },
  ],
};

/** Minimum sane per-guest spend (INR) below which we flag a tight-budget warning. */
const MIN_PER_GUEST: Record<EventType, number> = {
  wedding: 1200,
  birthday: 600,
  community: 150,
};

export function allocateBudget(input: EventInput): BudgetPlan {
  const rules = ALLOCATION_RULES[input.eventType];
  const guestCount = Math.max(1, input.guestCount);
  const perGuest = input.budget / guestCount;

  const lines: BudgetLine[] = rules.map((rule) => ({
    category: rule.category,
    percent: rule.percent,
    amount: Math.round((rule.percent / 100) * input.budget),
    note: rule.note,
  }));

  const tightBudget = perGuest < MIN_PER_GUEST[input.eventType];

  return {
    total: input.budget,
    perGuest: Math.round(perGuest),
    lines,
    tightBudget,
    warning: tightBudget
      ? `At ~₹${Math.round(perGuest)} per guest, this budget is tight for a ${input.eventType}. Consider trimming decor/entertainment or reducing the guest list to protect catering and venue quality.`
      : undefined,
  };
}
