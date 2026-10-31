import type { EventInput, EventType, Priority, VendorItem, VendorPlan } from "./types";

interface VendorTemplate {
  category: string;
  priority: Priority;
  leadTimeWeeks: number;
  tips: string;
}

const VENDOR_TEMPLATES: Record<EventType, VendorTemplate[]> = {
  wedding: [
    { category: "Venue", priority: "critical", leadTimeWeeks: 32, tips: "Visit in person, confirm power backup and parking." },
    { category: "Caterer", priority: "critical", leadTimeWeeks: 24, tips: "Request a tasting session before signing." },
    { category: "Photographer/Videographer", priority: "important", leadTimeWeeks: 20, tips: "Review full-event portfolios, not just highlight reels." },
    { category: "Decorator/Florist", priority: "important", leadTimeWeeks: 12, tips: "Share reference photos matching your vibe." },
    { category: "DJ/Band", priority: "optional", leadTimeWeeks: 8, tips: "Confirm sound equipment is included." },
    { category: "Makeup & styling", priority: "important", leadTimeWeeks: 12, tips: "Do a trial run 2-3 weeks before." },
  ],
  birthday: [
    { category: "Venue/Home setup", priority: "critical", leadTimeWeeks: 5, tips: "Confirm capacity matches guest count." },
    { category: "Caterer/Cake", priority: "critical", leadTimeWeeks: 3, tips: "Check allergy-friendly options." },
    { category: "Entertainer/Activities", priority: "important", leadTimeWeeks: 2, tips: "Age-appropriate games keep energy up." },
    { category: "Decorator", priority: "important", leadTimeWeeks: 2, tips: "Balloon/backdrop themes are budget-friendly." },
    { category: "Photographer", priority: "optional", leadTimeWeeks: 2, tips: "A friend with a good camera can suffice on tight budgets." },
  ],
  community: [
    { category: "Venue & permits", priority: "critical", leadTimeWeeks: 8, tips: "Confirm permit paperwork early with local authority." },
    { category: "Caterer/Refreshments", priority: "important", leadTimeWeeks: 4, tips: "Plan for 10% more than RSVP count." },
    { category: "Sound & stage", priority: "important", leadTimeWeeks: 4, tips: "Test equipment the day before." },
    { category: "Security/First-aid", priority: "critical", leadTimeWeeks: 3, tips: "Coordinate with local volunteers or professionals." },
    { category: "Signage & promotion", priority: "optional", leadTimeWeeks: 4, tips: "Use QR codes to drive RSVP tracking." },
  ],
};

export function buildVendorChecklist(input: EventInput, daysUntilEvent: number): VendorPlan {
  const templates = VENDOR_TEMPLATES[input.eventType];
  const weeksUntilEvent = daysUntilEvent / 7;

  const items: VendorItem[] = templates.map((template) => ({
    category: template.category,
    priority: template.priority,
    leadTimeWeeks: template.leadTimeWeeks,
    bookImmediately: weeksUntilEvent <= template.leadTimeWeeks,
    tips: template.tips,
  }));

  return { items };
}
