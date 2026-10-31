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
  anniversary: [
    { category: "Venue", priority: "critical", leadTimeWeeks: 7, tips: "Private dining or banquet hall both work well." },
    { category: "Caterer/Cake", priority: "critical", leadTimeWeeks: 4, tips: "A tasting session helps lock the right menu." },
    { category: "Photographer", priority: "important", leadTimeWeeks: 4, tips: "Ask for a candid-style portfolio." },
    { category: "Decorator/Florist", priority: "important", leadTimeWeeks: 2, tips: "A photo-wall doubles as a keepsake backdrop." },
    { category: "Musician/DJ", priority: "optional", leadTimeWeeks: 3, tips: "A curated playlist works on a tighter budget." },
  ],
  babyShower: [
    { category: "Venue/Home setup", priority: "critical", leadTimeWeeks: 5, tips: "Confirm capacity and accessibility for guests." },
    { category: "Caterer/Cake", priority: "critical", leadTimeWeeks: 3, tips: "Offer mocktail options alongside regular beverages." },
    { category: "Decorator", priority: "important", leadTimeWeeks: 2, tips: "Theme-based balloon arches are budget-friendly." },
    { category: "Games & favors vendor", priority: "important", leadTimeWeeks: 2, tips: "Order a few extra favors for walk-in guests." },
    { category: "Photographer", priority: "optional", leadTimeWeeks: 2, tips: "Candid coverage captures the games best." },
  ],
  graduation: [
    { category: "Venue/Home setup", priority: "critical", leadTimeWeeks: 5, tips: "Rooftop or lawn venues suit a relaxed theme." },
    { category: "Caterer/Cake", priority: "critical", leadTimeWeeks: 3, tips: "Check allergy-friendly options for mixed-age guests." },
    { category: "DJ/Entertainment", priority: "important", leadTimeWeeks: 3, tips: "A playlist of the graduate's favorites adds a personal touch." },
    { category: "Decorator", priority: "important", leadTimeWeeks: 2, tips: "A memory-wall of photos is a popular centerpiece." },
    { category: "Photographer", priority: "optional", leadTimeWeeks: 3, tips: "Group photos work best with natural light." },
  ],
  corporate: [
    { category: "Venue & AV vendor", priority: "critical", leadTimeWeeks: 10, tips: "Confirm Wi-Fi bandwidth and backup power." },
    { category: "Caterer", priority: "critical", leadTimeWeeks: 6, tips: "Offer vegetarian/vegan options by default." },
    { category: "Speakers/performers", priority: "important", leadTimeWeeks: 8, tips: "Confirm AV/technical requirements in advance." },
    { category: "Decor & branding vendor", priority: "important", leadTimeWeeks: 2, tips: "Keep branding consistent with company guidelines." },
    { category: "Photographer/Videographer", priority: "optional", leadTimeWeeks: 4, tips: "A short highlight reel is great for internal comms." },
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
